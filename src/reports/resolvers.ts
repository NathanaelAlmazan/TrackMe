import {
  Documents,
  Events,
  Reports,
  Status,
  SubmittedReports,
} from "@prisma/client";
import { GraphQLError } from "graphql";
import dataClient from "../data-client";
import pubsub from "../pubsub";

type CalendarReports = Reports & SubmittedReports;

interface CalendarEvents extends Events {
  dateDue?: string;
  type?: "EVENT" | "REPORT" | "DOCUMENT";
}

const resolvers = {
  Events: {
    id: (parent: CalendarEvents) => {
      return parent.id.toString();
    },

    date: (parent: CalendarEvents) => {
      return new Date(parent.date).toISOString();
    },

    dateDue: (parent: CalendarEvents) => {
      if (!parent.dateDue) return null;
      return new Date(parent.dateDue).toISOString();
    },
  },

  Reports: {
    id: (parent: Reports) => {
      return parent.id.toString();
    },

    localDue: (parent: Reports) => {
      return new Date(parent.localDue).toISOString();
    },

    nationalDue: (parent: Reports) => {
      return new Date(parent.nationalDue).toISOString();
    },
  },

  SubmittedReports: {
    id: (parent: SubmittedReports) => {
      return parent.id.toString();
    },

    report: async (parent: SubmittedReports) => {
      return await dataClient.reports.findUnique({
        where: {
          id: parent.reportId,
        },
      });
    },

    office: async (parent: SubmittedReports) => {
      return await dataClient.offices.findUnique({
        where: {
          id: parent.officeId,
        },
      });
    },

    localDue: (parent: SubmittedReports) => {
      return new Date(parent.localDue).toISOString();
    },

    dateCreated: (parent: SubmittedReports) => {
      return new Date(parent.dateCreated).toISOString();
    },

    nationalDue: (parent: SubmittedReports) => {
      return new Date(parent.nationalDue).toISOString();
    },

    files: (parent: SubmittedReports) => {
      return parent.files?.split(";");
    },

    pending: async (parent: SubmittedReports) => {
      const pending = await dataClient.submittedReports.aggregate({
        where: {
          reportId: parent.reportId,
          localDue: parent.localDue,
          nationalDue: parent.nationalDue,
          status: Status.REFERRED,
        },
        _count: true,
      });

      return pending._count;
    },
  },

  Query: {
    getReports: async () => {
      return await dataClient.reports.findMany({
        orderBy: {
          name: "asc",
        },
      });
    },

    getReportById: async (_: unknown, args: SubmittedReports) => {
      const submitted = await dataClient.submittedReports.findUnique({
        where: {
          id: args.id,
        },
        include: {
          report: true,
        },
      });

      if (!submitted)
        throw new GraphQLError("Report does not exist", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      return {
        ...submitted.report,
        localDue: submitted.localDue,
        nationalDue: submitted.nationalDue,
      };
    },

    getSubmittedReports: async (_: unknown, args: { officeId?: number }) => {
      if (args.officeId)
        return await dataClient.submittedReports.findMany({
          where: {
            officeId: args.officeId,
          },
          orderBy: {
            dateCreated: "desc",
          },
        });

      return dataClient.$queryRaw`SELECT DISTINCT ON ("reportId", "localDue", "nationalDue") * FROM public."SubmittedReports"`;
    },

    getSubmittedReportById: async (_: unknown, args: Reports) => {
      return await dataClient.submittedReports.findUnique({
        where: {
          id: args.id,
        },
      });
    },

    getOfficeSubmissions: async (_: unknown, args: Reports) => {
      const report = await dataClient.submittedReports.findUnique({
        where: {
          id: args.id,
        },
      });

      if (!report)
        throw new GraphQLError("Report does not exist", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      return await dataClient.submittedReports.findMany({
        where: {
          reportId: report.reportId,
          localDue: report.localDue,
          nationalDue: report.nationalDue,
        },
        orderBy: {
          dateCreated: "desc",
        },
      });
    },

    getReportSummary: async () => {
      const summary = await dataClient.submittedReports.groupBy({
        by: ["officeId", "status"],
        _count: {
          _all: true,
        },
      });

      const offices = await dataClient.offices.findMany();

      return offices.map((office) => ({
        office: office.name,
        total: summary
          .filter((stat) => stat.officeId === office.id)
          .reduce(
            (sum, stat) => sum + parseInt(stat._count._all.toString()),
            0
          ),
        submitted: summary
          .filter(
            (stat) => stat.officeId === office.id && stat.status === "FINISHED"
          )
          .reduce(
            (sum, stat) => sum + parseInt(stat._count._all.toString()),
            0
          ),
        pending: summary
          .filter(
            (stat) => stat.officeId === office.id && stat.status === "REFERRED"
          )
          .reduce(
            (sum, stat) => sum + parseInt(stat._count._all.toString()),
            0
          ),
      }));
    },

    getReportStatistics: async (_: unknown, args: { officeId?: number }) => {
      const statistics = await dataClient.submittedReports.groupBy({
        by: ["status"],
        where: {
          officeId: args.officeId,
        },
        _count: {
          _all: true,
        },
      });

      const overdue = await dataClient.submittedReports.aggregate({
        where: {
          OR: [
            {
              localDue: {
                lt: new Date(),
              },
            },
            {
              nationalDue: {
                lt: new Date(),
              },
            },
          ],
          status: Status.REFERRED,
          officeId: args.officeId,
        },
        _count: {
          _all: true,
        },
      });

      return {
        total: statistics.reduce(
          (total, report) => total + report._count._all,
          0
        ),
        submitted:
          statistics.find((stats) => stats.status === Status.FINISHED)?._count
            ._all || 0,
        pending:
          statistics.find((stats) => stats.status === Status.REFERRED)?._count
            ._all || 0,
        overdue: overdue._count._all,
      };
    },

    getEvents: async (
      _: unknown,
      args: { date: string; officeId?: number }
    ) => {
      const today = new Date(args.date).toISOString().split("T")[0];

      // get events
      const events: Events[] = await dataClient.$queryRaw`SELECT *
                            FROM public."Events"
                            WHERE (
                                    EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND "frequency" = 'YEARLY'
                                ) OR (
                                    EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND "frequency" = 'NONE'
                                ) OR "frequency" = 'MONTHLY'`;

      // get reports
      const reports: Reports[] = await dataClient.$queryRaw`SELECT *
                            FROM public."Reports"
                            WHERE (
                                    EXTRACT(MONTH FROM "localDue") = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND "frequency" = 'YEARLY'
                                ) OR (
                                    EXTRACT(MONTH FROM "localDue") = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND EXTRACT(YEAR FROM "localDue") = EXTRACT(YEAR FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND "frequency" = 'NONE'
                                ) OR "frequency" = 'MONTHLY'`;

      const documents: Documents[] =
        await dataClient.$queryRaw`SELECT DISTINCT doc."referenceNum", doc.subject, doc."dateDue"
                                FROM public."Referrals" rfl
                                INNER JOIN public."DocumentStatus" status ON status.id = rfl."statusId"
                                INNER JOIN public."Documents" doc ON doc."referenceNum" = rfl."documentId"
                                WHERE status.category != 'NOT_ACTIONABLE'
                                AND EXTRACT(MONTH FROM doc."dateDue") = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                AND EXTRACT(YEAR FROM doc."dateDue") = EXTRACT(YEAR FROM TO_DATE(${today}, 'YYYY-MM-DD'))`;

      // get submissions
      const submissions: CalendarReports[] =
        await dataClient.$queryRaw`SELECT DISTINCT ON (sub."reportId", sub."localDue", sub."nationalDue") 
                                sub."id" AS "id",
                                sub."reportId",
                                sub."localDue",
                                sub."nationalDue",
                                rep."name",
                                rep."basis"
                                FROM public."SubmittedReports" sub
                                INNER JOIN public."Reports" rep ON rep.id = sub."reportId"
                                WHERE (
                                        EXTRACT(MONTH FROM sub."localDue") = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                        AND EXTRACT(YEAR FROM sub."localDue") = EXTRACT(YEAR FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    ) OR (
                                        EXTRACT(MONTH FROM sub."nationalDue") = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                        AND EXTRACT(YEAR FROM sub."nationalDue") = EXTRACT(YEAR FROM TO_DATE(${today}, 'YYYY-MM-DD')))`;

      // filter documents by ref number
      let assigned: string[] = [];
      if (args.officeId) {
        const office = await dataClient.offices.findUnique({
          where: {
            id: args.officeId,
          },
          include: {
            referrals: {
              select: {
                documentId: true,
              },
            },
          },
        });

        if (office) assigned = office.referrals.map((ref) => ref.documentId);
      }

      return events
        .map((event) => ({
          id: event.id.toString(),
          subject: event.subject,
          description: event.description,
          image: event.image,
          date: new Date(event.date).toISOString(),
          dateDue: "",
          frequency: event.frequency,
          type: "EVENT",
        }))
        .concat(
          reports
            .filter(
              (report) => !submissions.find((sub) => sub.reportId === report.id)
            )
            .map((report) => ({
              id: report.name,
              subject: report.name,
              description: report.basis,
              image: null,
              date: new Date(report.localDue).toISOString(),
              dateDue: new Date(report.nationalDue).toISOString(),
              frequency: report.frequency,
              type: report.type === "HR" ? "HR_REPORT" : "ADMIN_REPORT",
            }))
        )
        .concat(
          documents
            .filter(
              (document) =>
                assigned.includes(document.referenceNum) || !args.officeId
            )
            .map((document) => ({
              id: document.referenceNum,
              subject: document.referenceNum,
              description: document.subject,
              image: null,
              date: document.dateDue ? new Date(document.dateDue).toISOString() : "",
              dateDue: "",
              frequency: "NONE",
              type: "DOCUMENT",
            }))
        )
        .concat(
          submissions.map((submit) => ({
            id: submit.id.toString(),
            subject: submit.name,
            description: submit.basis,
            image: null,
            date: new Date(submit.localDue).toISOString(),
            dateDue: new Date(submit.nationalDue).toISOString(),
            frequency: "NONE",
            type: submit.type === "HR" ? "HR_REPORT" : "ADMIN_REPORT",
          }))
        );
    },

    getEventById: async (_: unknown, args: Events) => {
      return await dataClient.events.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },

  Mutation: {
    // ============================== EVENTS ===================================
    createEvent: async (_: unknown, args: Events) => {
      return await dataClient.events.create({
        data: {
          subject: args.subject,
          description: args.description,
          image: args.image,
          date: args.date,
          frequency: args.frequency,
        },
      });
    },

    updateEvent: async (_: unknown, args: Events) => {
      return await dataClient.events.update({
        where: {
          id: args.id,
        },
        data: {
          subject: args.subject,
          description: args.description,
          image: args.image,
          date: args.date,
          frequency: args.frequency,
        },
      });
    },

    deleteEvent: async (_: unknown, args: Events) => {
      return await dataClient.events.delete({
        where: {
          id: args.id,
        },
      });
    },

    // ============================== REPORTS ===================================
    createReport: async (_: unknown, args: Reports) => {
      const report = await dataClient.reports.create({
        data: {
          name: args.name,
          basis: args.basis,
          localDue: new Date(args.localDue),
          nationalDue: new Date(args.nationalDue),
          frequency: args.frequency,
          type: args.type,
        },
      });

      const offices = await dataClient.offices.findMany({
        select: {
          id: true,
        },
      });

      pubsub.publish("OFFICE_ADMIN", {
        officeEvents: {
          eventName: `CREATED_REPORT_${report.name}`,
          eventDate: new Date().toISOString(),
        },
      });

      for (let i = 0; i < offices.length; i++) {
        const office = offices[i];
        await dataClient.submittedReports.create({
          data: {
            reportId: report.id,
            officeId: office.id,
            localDue: new Date(args.localDue),
            nationalDue: new Date(args.nationalDue),
            status: Status.REFERRED,
          },
        });

        // trigger create report event
        pubsub.publish(`OFFICE_${office.id.toString()}`, {
          officeEvents: {
            eventName: `CREATED_REPORT_${report.name}`,
            eventDate: new Date().toISOString(),
          },
        });
      }

      return report;
    },

    updateReport: async (_: unknown, args: Reports) => {
      // get current report deadline
      const report = await dataClient.submittedReports.findUnique({
        where: {
          id: args.id,
        },
        select: {
          reportId: true,
          localDue: true,
          nationalDue: true,
        },
      });

      if (!report)
        throw new GraphQLError("Report does not exist", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      // update report deadline
      const updated = await dataClient.reports.update({
        where: {
          id: report.reportId,
        },
        data: {
          name: args.name,
          basis: args.basis,
          frequency: args.frequency,
          type: args.type,
        },
        include: {
          submitted: {
            select: {
              officeId: true,
            },
          },
        },
      });

      // update latest report submissions
      await dataClient.submittedReports.updateMany({
        where: {
          localDue: report.localDue,
          nationalDue: report.nationalDue,
        },
        data: {
          localDue: new Date(args.localDue),
          nationalDue: new Date(args.nationalDue),
        },
      });

      // trigger update report event
      pubsub.publish("OFFICE_ADMIN", {
        officeEvents: {
          eventName: `UPDATED_REPORT_${updated.name}`,
          eventDate: new Date().toISOString(),
        },
      });

      for (let i = 0; i < updated.submitted.length; i++) {
        const office = updated.submitted[i];

        // trigger update report event
        pubsub.publish(`OFFICE_${office.officeId.toString()}`, {
          officeEvents: {
            eventName: `UPDATED_REPORT_${updated.name}`,
            eventDate: new Date().toISOString(),
          },
        });
      }

      return updated;
    },

    deleteReport: async (_: unknown, args: Reports) => {
      const deleted = await dataClient.reports.delete({
        where: {
          id: args.id,
        },
        include: {
          submitted: {
            select: {
              officeId: true,
            },
          },
        },
      });

      pubsub.publish("OFFICE_ADMIN", {
        officeEvents: {
          eventName: `DELETED_REPORT_${deleted.name}`,
          eventDate: new Date().toISOString(),
        },
      });

      for (let i = 0; i < deleted.submitted.length; i++) {
        const office = deleted.submitted[i];

        // trigger delete report event
        pubsub.publish(`OFFICE_${office.officeId.toString()}`, {
          officeEvents: {
            eventName: `DELETED_REPORT_${deleted.name}`,
            eventDate: new Date().toISOString(),
          },
        });
      }

      return deleted;
    },

    submitReport: async (
      _: unknown,
      args: { id: number; message: string; files: string[] }
    ) => {
      const submitted = await dataClient.submittedReports.update({
        where: {
          id: args.id,
        },
        data: {
          status: "FINISHED",
          message: args.message,
          files: args.files.join(";"),
        },
        include: {
          report: {
            select: {
              name: true,
            },
          },
          office: {
            select: {
              id: true,
            },
          },
        },
      });

      pubsub.publish("OFFICE_ADMIN", {
        officeEvents: {
          eventName: `SUBMITTED_REPORT_${submitted.report.name}`,
          eventDate: new Date().toISOString(),
        },
      });

      pubsub.publish(`OFFICE_${submitted.office.id.toString()}`, {
        officeEvents: {
          eventName: `SUBMITTED_REPORT_${submitted.report.name}`,
          eventDate: new Date().toISOString(),
        },
      });

      return submitted;
    },

    // =============================== SUBMISSIONS ==================================

    createSubmission: async (_: unknown, args: SubmittedReports) => {
      const report = await dataClient.reports.findUnique({
        where: {
          id: args.reportId,
        },
      });

      if (!report)
        throw new GraphQLError("Report does not exist", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      const offices = await dataClient.offices.findMany({
        select: {
          id: true,
        },
      });

      pubsub.publish("OFFICE_ADMIN", {
        officeEvents: {
          eventName: `CREATED_REPORT_${report.name}`,
          eventDate: new Date().toISOString(),
        },
      });

      for (let i = 0; i < offices.length; i++) {
        const office = offices[i];
        await dataClient.submittedReports.create({
          data: {
            reportId: report.id,
            officeId: office.id,
            localDue: new Date(args.localDue),
            nationalDue: new Date(args.nationalDue),
            status: Status.REFERRED,
          },
        });

        // trigger create report event
        pubsub.publish(`OFFICE_${office.id.toString()}`, {
          officeEvents: {
            eventName: `CREATED_REPORT_${report.name}`,
            eventDate: new Date().toISOString(),
          },
        });
      }

      return report;
    },

    deleteSubmission: async (_: unknown, args: SubmittedReports) => {
      const submission = await dataClient.submittedReports.findUnique({
        where: {
          id: args.id,
        },
      });

      await dataClient.submittedReports.deleteMany({
        where: {
          reportId: submission?.reportId,
          localDue: submission?.localDue,
          nationalDue: submission?.nationalDue,
        },
      });

      return submission;
    },
  },
};

export default resolvers;
