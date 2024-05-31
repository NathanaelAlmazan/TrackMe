import {
  Assignment,
  Comments,
  DocumentPurpose,
  DocumentStatus,
  DocumentTypes,
  Documents,
  Referrals,
  Role,
  Status,
} from "@prisma/client";
import webpush from "web-push";
import { withFilter } from "graphql-subscriptions";
import dataClient from "../data-client";
import pubsub from "../pubsub";
import { getDocumentStatus } from "../routines/documents";
import { GraphQLError } from "graphql";
import { BIN_OFFICE } from "../users/resolvers";

interface DocumentInput extends Documents {
  assignedTo: string[];
  referredTo: {
    officeId: number;
    statusId: number;
  }[];
}

interface CommentInput {
  documentId: string;
  senderId: string;
  recipientId: string;
  message: string;
}

const resolvers = {
  DocumentStatus: {
    id: (parent: DocumentStatus) => {
      return parent.id.toString();
    },
  },

  DocumentTypes: {
    id: (parent: DocumentTypes) => {
      return parent.id.toString();
    },
  },

  DocumentPurpose: {
    id: (parent: DocumentPurpose) => {
      return parent.id.toString();
    },
  },

  Referrals: {
    office: async (parent: Referrals) => {
      return await dataClient.offices.findUnique({
        where: {
          id: parent.officeId,
        },
      });
    },

    status: async (parent: Referrals) => {
      if (!parent.statusId) return null;

      return await dataClient.documentStatus.findUnique({
        where: {
          id: parent.statusId,
        },
      });
    },

    assigned: async (parent: Referrals) => {
      return await dataClient.assigned.findMany({
        where: {
          documentId: parent.documentId,
          officer: {
            officeId: parent.officeId,
          },
        },
      });
    },
  },

  Documents: {
    type: async (parent: Documents) => {
      if (!parent.typeId) return null;

      return await dataClient.documentTypes.findUnique({
        where: {
          id: parent.typeId,
        },
      });
    },

    purpose: async (parent: Documents) => {
      const ids = parent.purposeIds.split(",").map((id) => parseInt(id));

      return await dataClient.documentPurpose.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    },

    signatory: async (parent: Documents) => {
      if (!parent.signatureId) return null;

      return await dataClient.officers.findUnique({
        where: {
          uuid: parent.signatureId,
        },
      });
    },

    dateCreated: (parent: Documents) => {
      return parent.dateCreated.toISOString();
    },

    dateDue: (parent: Documents) => {
      if (!parent.dateDue) return null;
      return parent.dateDue.toISOString();
    },

    status: async (parent: Documents) => {
      const referrals = await dataClient.referrals.findMany({
        where: {
          documentId: parent.referenceNum,
        },
        select: {
          status: {
            select: {
              category: true,
            },
          },
        },
      });

      if (
        referrals.filter(
          (ref) => ref.status?.category === Status.NOT_ACTIONABLE
        ).length > 0
      )
        return "Not Actionable";
      else
        return getDocumentStatus(
          referrals.map((ref) =>
            ref.status ? ref.status.category : Status.NOT_ACTIONABLE
          )
        );
    },

    referredTo: async (parent: Documents) => {
      const referrals = await dataClient.referrals.findMany({
        where: {
          documentId: parent.referenceNum,
        },
      });

      return referrals;
    },

    directorAssigned: async (parent: Documents) => {
      const assigned = await dataClient.assigned.findMany({
        where: {
          documentId: parent.referenceNum,
          assignee: Role.DIRECTOR,
        },
        select: {
          officer: true,
        },
      });

      return assigned.map((obj) => obj.officer);
    },

    chiefAssigned: async (parent: Documents, args: { officerId: string }) => {
      const officer = await dataClient.officers.findUnique({
        where: {
          uuid: args.officerId,
        },
        select: {
          officeId: true,
          position: {
            select: {
              role: true,
            },
          },
        },
      });

      if (!officer || !officer.officeId) return [];

      const assigned = await dataClient.assigned.findMany({
        where: {
          documentId: parent.referenceNum,
          assignee: Role.CHIEF,
          officer: {
            office: {
              id: officer.officeId,
            },
          },
        },
        select: {
          officer: true,
        },
      });

      return assigned.map((obj) => obj.officer);
    },

    comments: async (parent: Documents, args: { officerId: string }) => {
      return await dataClient.comments.findMany({
        where: {
          documentId: parent.referenceNum,
          OR: [
            {
              sender: args.officerId,
            },
            {
              recipient: args.officerId,
            },
          ],
        },
        orderBy: {
          dateCreated: "asc",
        },
      });
    },

    recipients: async (parent: Documents, args: { officerId: string }) => {
      // if regional director, return all assigned
      const officer = await dataClient.officers.findUnique({
        where: {
          uuid: args.officerId,
        },
        select: {
          officeId: true,
          position: {
            select: {
              role: true,
            },
          },
        },
      });

      if (!officer) return [];

      if (officer.position?.role === Role.DIRECTOR) {
        return await dataClient.officers.findMany({
          where: {
            assigned: {
              some: {
                documentId: parent.referenceNum,
              },
            },
          }
        })
      }

      // else find the officer among the assigned
      const assigned = await dataClient.assigned.findFirst({
        where: {
          documentId: parent.referenceNum,
          officerId: args.officerId,
        }
      });

      if (!assigned) return [];

      // if director assigned return director contact
      if (assigned.assignee === Role.DIRECTOR) {
        return await dataClient.officers.findMany({
          where: {
            position: {
              role: Role.DIRECTOR,
            }
          }
        })
      }
      // if chief assigned return chief contact
      else if (assigned.assignee === Role.CHIEF) {
        return await dataClient.officers.findMany({
          where: {
            officeId: officer.officeId,
            position: {
              role: Role.CHIEF,
            }
          }
        })
      }
      // if automaticall assigned return office contact
      else if (assigned.assignee === Role.SUPERUSER) {
        return await dataClient.officers.findMany({
          where: {
            OR: [
              {
                officeId: officer.officeId
              },
              {
                position: {
                  role: Role.DIRECTOR
                }
              }
            ]
          }
        })
      }
      // if none satisfied return empty
      return [];
    },
  },

  Comments: {
    id: (parent: Comments) => {
      return parent.id.toString();
    },

    sender: async (parent: Comments) => {
      return await dataClient.officers.findUnique({
        where: {
          uuid: parent.sender,
        },
      });
    },

    recipient: async (parent: Comments) => {
      return await dataClient.officers.findUnique({
        where: {
          uuid: parent.recipient,
        },
      });
    },

    dateCreated: (parent: Comments) => {
      return parent.dateCreated.toISOString();
    },
  },

  Query: {
    getDocumentTypes: async () => {
      return await dataClient.documentTypes.findMany({
        orderBy: {
          label: "asc",
        },
      });
    },

    getDocumentPurposes: async () => {
      return await dataClient.documentPurpose.findMany({
        orderBy: {
          label: "asc",
        },
      });
    },

    getDocumentStatus: async () => {
      return await dataClient.documentStatus.findMany({
        orderBy: {
          label: "asc",
        },
      });
    },

    getDocuments: async (_: unknown, args: { officerId: string }) => {
      const officer = await dataClient.officers.findUnique({
        where: {
          uuid: args.officerId,
        },
        include: {
          position: {
            select: {
              role: true,
            },
          },
        },
      });

      if (!officer || !officer.position || !officer.officeId)
        throw new GraphQLError("Officer not found.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      if (
        officer.position.role === Role.SUPERUSER ||
        officer.position.role === Role.DIRECTOR
      )
        return await dataClient.documents.findMany({
          orderBy: {
            dateCreated: "asc",
          },
        });
      else if (officer.position.role === Role.CHIEF)
        return dataClient.documents.findMany({
          where: {
            referrals: {
              some: {
                officeId: officer.officeId,
              },
            },
          },
          orderBy: {
            dateCreated: "asc",
          },
        });
      else
        return dataClient.documents.findMany({
          where: {
            assigned: {
              some: {
                officerId: args.officerId,
              },
            },
          },
          orderBy: {
            dateCreated: "asc",
          },
        });
    },

    getDocumentById: async (_: unknown, args: Documents) => {
      return await dataClient.documents.findUnique({
        where: {
          referenceNum: args.referenceNum,
        },
      });
    },

    getTempReferenceNum: async () => {
      // get current count
      const today = new Date();
      const document = await dataClient.documents.findFirst({
        where: {
          dateCreated: {
            gt: new Date(today.getFullYear(), today.getMonth(), 0),
          },
        },
        orderBy: {
          referenceNum: "desc",
        },
        select: {
          referenceNum: true,
        },
      });

      // generate reference number
      let serial: string = document
        ? document.referenceNum.split("-")[3]
        : "00000";

      return `RR6-${today.getFullYear()}-${today.getMonth() + 1}-${String(
        parseInt(serial) + 1
      ).padStart(5, "0")}`;
    },

    getDocumentSummary: async () => {
      const summary: { officeId: BigInt; category: string; count: number }[] =
        await dataClient.$queryRaw`
                SELECT rfl."officeId", status.category, COUNT(*) 
                FROM public."Referrals" rfl
                INNER JOIN public."DocumentStatus" status
                ON status.id = rfl."statusId"
                GROUP BY rfl."officeId", status.category;`;

      const offices = await dataClient.offices.findMany();

      return offices.map((office) => ({
        office: office.name,
        referred: summary
          .filter((stat) => stat.officeId === office.id)
          .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
        closed: summary
          .filter(
            (stat) =>
              stat.officeId === office.id && stat.category === "FINISHED"
          )
          .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
        ongoing: summary
          .filter(
            (stat) =>
              stat.officeId === office.id &&
              stat.category !== "NOT_ACTIONABLE" &&
              stat.category !== "FINISHED"
          )
          .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
        noaction: summary
          .filter(
            (stat) =>
              stat.officeId === office.id && stat.category === "NOT_ACTIONABLE"
          )
          .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
      }));
    },

    getDocumentStatistics: async (_: unknown, args: { officeId?: number }) => {
      let statistics: { documentId: string; category: string; count: BigInt }[];

      if (args.officeId) {
        // statistics for each offices
        statistics = await dataClient.$queryRaw`
                    SELECT rfl."documentId", status.category, COUNT(*) 
                    FROM public."Referrals" rfl
                    INNER JOIN public."DocumentStatus" status
                    ON status.id = rfl."statusId"
                    WHERE rfl."officeId" = ${args.officeId}
                    GROUP BY rfl."documentId", status.category`;
      } else {
        // admin statistics
        statistics = await dataClient.$queryRaw`
                    SELECT rfl."documentId", status.category, COUNT(*) 
                    FROM public."Referrals" rfl
                    INNER JOIN public."DocumentStatus" status
                    ON status.id = rfl."statusId"
                    GROUP BY rfl."documentId", status.category;`;
      }

      return {
        referred: statistics.reduce(
          (acc, stat) => acc + parseInt(stat.count.toString()),
          0
        ),
        closed: statistics
          .filter((stat) => stat.category === "FINISHED")
          .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
        ongoing: statistics
          .filter(
            (stat) =>
              stat.category !== "NOT_ACTIONABLE" && stat.category !== "FINISHED"
          )
          .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
        noaction: statistics
          .filter((stat) => stat.category === "NOT_ACTIONABLE")
          .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
      };
    },
  },

  Mutation: {
    // ============================== DOCUMENT TYPES ===================================

    createDocumentType: async (_: unknown, args: DocumentTypes) => {
      return await dataClient.documentTypes.create({
        data: {
          label: args.label,
        },
      });
    },

    updateDocumentType: async (_: unknown, args: DocumentTypes) => {
      return await dataClient.documentTypes.update({
        where: {
          id: args.id,
        },
        data: {
          label: args.label,
        },
      });
    },

    deleteDocumentType: async (_: unknown, args: DocumentTypes) => {
      const types = await dataClient.documents.aggregate({
        where: {
          typeId: args.id,
        },
        _count: true,
      });

      if (types._count > 0)
        throw new GraphQLError("There are active documents under this type.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      return await dataClient.documentTypes.delete({
        where: {
          id: args.id,
        },
      });
    },

    // ============================== DOCUMENT PURPOSES ===================================

    createDocumentPurpose: async (_: unknown, args: DocumentPurpose) => {
      return await dataClient.documentPurpose.create({
        data: {
          label: args.label,
        },
      });
    },

    updateDocumentPurpose: async (_: unknown, args: DocumentPurpose) => {
      return await dataClient.documentPurpose.update({
        where: {
          id: args.id,
        },
        data: {
          label: args.label,
        },
      });
    },

    deleteDocumentPurpose: async (_: unknown, args: DocumentPurpose) => {
      return await dataClient.documentPurpose.delete({
        where: {
          id: args.id,
        },
      });
    },

    // ============================== DOCUMENT STATUS ===================================

    createDocumentStatus: async (_: unknown, args: DocumentStatus) => {
      return await dataClient.documentStatus.create({
        data: {
          label: args.label,
          category: args.category,
        },
      });
    },

    updateDocumentStatus: async (_: unknown, args: DocumentStatus) => {
      return await dataClient.documentStatus.update({
        where: {
          id: args.id,
        },
        data: {
          label: args.label,
          category: args.category,
        },
      });
    },

    deleteDocumentStatus: async (_: unknown, args: DocumentStatus) => {
      const status = await dataClient.referrals.aggregate({
        where: {
          statusId: args.id,
        },
        _count: true,
      });

      if (status._count > 0)
        throw new GraphQLError(
          "There are active documents under this status.",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );

      return await dataClient.documentStatus.delete({
        where: {
          id: args.id,
        },
      });
    },

    // ============================== DOCUMENTS ===================================

    createDocument: async (_: unknown, args: DocumentInput) => {
      const {
        subject,
        description,
        receivedFrom,
        typeId,
        purposeIds,
        signatureId,
        tag,
        dateDue,
        referredTo,
        assignedTo,
      } = args;

      // get current count
      const today = new Date();
      const document = await dataClient.documents.findFirst({
        where: {
          dateCreated: {
            gt: new Date(today.getFullYear(), today.getMonth(), 0),
          },
        },
        orderBy: {
          referenceNum: "desc",
        },
        select: {
          referenceNum: true,
        },
      });

      // generate reference number
      let serial: string = document
        ? document.referenceNum.split("-")[3]
        : "00000";
      const referenceNum = `RR6-${today.getFullYear()}-${
        today.getMonth() + 1
      }-${String(parseInt(serial) + 1).padStart(5, "0")}`;

      // trigger assigned document event
      pubsub.publish("OFFICE_EVENTS", {
        officeEvents: {
          eventId: referredTo.map((ref) => ref.officeId.toString()),
          eventName: `ASSIGNED_DOCUMENT_${referenceNum}`,
          eventDate: new Date().toISOString(),
        },
      });

      const assignedOfficers = assignedTo.filter(
        (officer) => !officer.includes("Add")
      );

      // save unknown assigned officers
      for (const officer of assignedTo.filter((officer) =>
        officer.includes("Add")
      )) {
        const temp = await dataClient.officers.upsert({
          where: {
            firstName_lastName: {
              firstName: officer.split(" ", 3)[1],
              lastName: officer.split(" ", 3)[2] || "",
            },
          },
          update: {
            officeId: referredTo.length === 1 ? referredTo[0].officeId : BIN_OFFICE,
          },
          create: {
            firstName: officer.split(" ", 3)[1],
            lastName: officer.split(" ", 3)[2] || "",
            officeId: referredTo.length === 1 ? referredTo[0].officeId : BIN_OFFICE,
          },
        });

        assignedOfficers.push(temp.uuid);
      }

      // get initial assigned
      let officers: {
        uuid: string;
        device: string | null;
        position: {
          role: Role;
        } | null;
      }[] = [];
      if (assignedOfficers.length > 0) {
        officers = await dataClient.officers.findMany({
          where: {
            uuid: {
              in: assignedOfficers,
            },
          },
          select: {
            uuid: true,
            device: true,
            position: {
              select: {
                role: true,
              },
            },
          },
        });
      } else {
        officers = await dataClient.officers.findMany({
          where: {
            officeId: {
              in: referredTo.map((ref) => ref.officeId),
            },
            position: {
              role: Role.CHIEF,
            },
          },
          select: {
            uuid: true,
            device: true,
            position: {
              select: {
                role: true,
              },
            },
          },
        });
      }

      const payload = JSON.stringify({
        title: `Assigned ${referenceNum}`,
        body: `You are assigned to accomplish ${referenceNum}`,
        icon: "https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png",
      });

      officers.forEach((officer) => {
        if (officer.device)
          webpush
            .sendNotification(JSON.parse(officer.device), payload)
            .catch((err) => console.error(err));
      });

      // create new document
      return await dataClient.documents.create({
        data: {
          referenceNum: referenceNum,
          subject: subject,
          description: description,
          receivedFrom: receivedFrom,
          typeId: typeId,
          purposeIds: purposeIds,
          signatureId: signatureId,
          tag: tag,
          dateDue: dateDue ? new Date(dateDue) : null,
          referrals: {
            createMany: {
              data: referredTo,
            },
          },
          assigned: {
            createMany: {
              data: officers.map((officer) => ({
                officerId: officer.uuid,
                assignment:
                  officer.position?.role === Role.CHIEF
                    ? Assignment.APPROVER
                    : Assignment.MEMBER,
                assignee:
                  assignedOfficers.length > 0 ? Role.DIRECTOR : Role.SUPERUSER,
              })),
            },
          },
        },
      });
    },

    updateDocument: async (_: unknown, args: DocumentInput) => {
      const {
        referenceNum,
        subject,
        description,
        receivedFrom,
        typeId,
        purposeIds,
        signatureId,
        tag,
        dateDue,
      } = args;

      const referredTo = await dataClient.referrals.findMany({
        where: {
          documentId: referenceNum,
        },
        select: {
          officeId: true,
        },
      });

      // trigger reassigned document event
      pubsub.publish("OFFICE_EVENTS", {
        officeEvents: {
          eventId: referredTo.map((ref) => ref.officeId.toString()),
          eventName: `UPDATED_DOCUMENT_${referenceNum}`,
          eventDate: new Date().toISOString(),
        },
      });

      return await dataClient.documents.update({
        where: {
          referenceNum: referenceNum,
        },
        data: {
          subject: subject,
          description: description,
          receivedFrom: receivedFrom,
          typeId: typeId,
          purposeIds: purposeIds,
          signatureId: signatureId,
          tag: tag,
          dateDue: dateDue ? new Date(dateDue) : null,
        },
      });
    },

    documentUpdateStatus: async (
      _: unknown,
      args: { referenceNum: string; officeId: number; statusId: number }
    ) => {
      const updated = await dataClient.referrals.update({
        where: {
          officeId_documentId: {
            officeId: args.officeId,
            documentId: args.referenceNum,
          },
        },
        data: {
          statusId: args.statusId,
        },
        select: {
          status: true,
        },
      });

      // trigger updated document event
      pubsub.publish("DOCUMENT_EVENTS", {
        documentEvents: {
          eventId: args.referenceNum,
          eventName: `UPDATED_DOCUMENT_${args.referenceNum}`,
          eventDate: new Date().toISOString(),
        },
      });

      // trigger updated document event
      pubsub.publish("OFFICE_EVENTS", {
        officeEvents: {
          eventId: [args.officeId.toString()],
          eventName: `UPDATED_DOCUMENT_${args.referenceNum}`,
          eventDate: new Date().toISOString(),
        },
      });

      // send notifications
      const recipients = await dataClient.officers.findMany({
        where: {
          OR: [
            {
              position: {
                role: Role.DIRECTOR,
              },
            },
            {
              officeId: args.officeId,
            },
          ],
        },
      });

      const payload = JSON.stringify({
        title: `${updated.status?.label} ${args.referenceNum}`,
        body: `Document status changed to ${updated.status?.label}`,
        icon: "https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png",
      });

      recipients.forEach((officer) => {
        if (officer.device)
          webpush
            .sendNotification(JSON.parse(officer.device), payload)
            .catch((err) => console.error(err));
      });

      return updated.status;
    },

    deleteDocument: async (_: unknown, args: DocumentInput) => {
      const { referenceNum } = args;

      const deleted = await dataClient.documents.delete({
        where: {
          referenceNum: referenceNum,
        },
        include: {
          referrals: {
            select: {
              officeId: true,
            },
          },
        },
      });

      // trigger assigned document event
      pubsub.publish("OFFICE_EVENTS", {
        officeEvents: {
          eventId: deleted.referrals.map((ref) => ref.officeId.toString()),
          eventName: `DELETED_DOCUMENT_${referenceNum}`,
          eventDate: new Date().toISOString(),
        },
      });

      return deleted;
    },

    createComment: async (_: unknown, args: CommentInput) => {
      const { senderId, recipientId, documentId, message } = args;

      // trigger updated document event
      pubsub.publish("DOCUMENT_EVENTS", {
        documentEvents: {
          eventId: documentId,
          eventName: `ADDED_COMMENT_${documentId}`,
          eventDate: new Date().toISOString(),
        },
      });

      return await dataClient.comments.create({
        data: {
          documentId: documentId,
          sender: senderId,
          recipient: recipientId,
          message: message,
        },
      });
    },

    assignOfficers: async (
      _: unknown,
      args: { documentId: string; officerIds: string[] }
    ) => {
      // reset the assignments
      await dataClient.assigned.deleteMany({
        where: {
          documentId: args.documentId,
          assignee: Role.CHIEF,
        },
      });

      // save new assignments
      await dataClient.assigned.createMany({
        data: args.officerIds.map((officerId) => ({
          documentId: args.documentId,
          officerId: officerId,
          assignment: Assignment.MEMBER,
          assignee: Role.CHIEF,
        })),
      });

      // send notifications to assigned officers
      const recipients = await dataClient.officers.findMany({
        where: {
          uuid: {
            in: args.officerIds,
          },
        },
      });

      const payload = JSON.stringify({
        title: `Assigned ${args.documentId}`,
        body: `You are assigned to accomplish ${args.documentId}`,
        icon: "https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png",
      });

      recipients.forEach((officer) => {
        if (officer.device)
          webpush
            .sendNotification(JSON.parse(officer.device), payload)
            .catch((err) => console.error(err));
      });

      return await dataClient.documents.findUnique({
        where: {
          referenceNum: args.documentId,
        },
      });
    },
  },

  Subscription: {
    officeEvents: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("OFFICE_EVENTS"),
        (payload, variables) => {
          if (!variables.officeId) return true;
          return payload.officeEvents.eventId.includes(
            variables.officeId.toString()
          );
        }
      ),
    },

    documentEvents: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("DOCUMENT_EVENTS"),
        (payload, variables) => {
          return payload.documentEvents.eventId === variables.referenceNum;
        }
      ),
    },
  },
};

export default resolvers;
