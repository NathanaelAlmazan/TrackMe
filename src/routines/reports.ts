import { Frequency, Status } from "@prisma/client";
import dataClient from "../data-client";
import pubsub from "../pubsub";

export function nextDate(date: Date, frequency: Frequency) {
  switch (frequency) {
    case Frequency.MONTHLY:
      return new Date(date.setMonth(date.getMonth() + 1));
    case Frequency.YEARLY:
      return new Date(date.setFullYear(date.getFullYear() + 1));
    default:
      return date;
  }
}

export async function autoGenerateReports() {
  // get reports that pass the deadline
  const reports = await dataClient.reports.findMany({
    where: {
      nationalDue: {
        lt: new Date(),
      },
      frequency: {
        not: "NONE",
      },
    },
  });

  // get report offices
  const offices = await dataClient.offices.findMany({
    select: {
      id: true,
    },
    where: {
      id: {
        not: {
          in: [18, 19, 20]
        }
      }
    }
  });

  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];

    const nextLocalDeadline = nextDate(report.localDue, report.frequency);
    const nextNationalDeadline = nextDate(report.nationalDue, report.frequency);

    for (let i = 0; i < offices.length; i++) {
      const office = offices[i];

      // generate new submission
      await dataClient.submittedReports.create({
        data: {
          reportId: report.id,
          officeId: office.id,
          localDue: nextLocalDeadline,
          nationalDue: nextNationalDeadline,
          status: Status.REFERRED,
        },
      });

      // update report next due date
      await dataClient.reports.update({
        where: {
          id: report.id,
        },
        data: {
          localDue: nextLocalDeadline,
          nationalDue: nextNationalDeadline,
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
  }
}
