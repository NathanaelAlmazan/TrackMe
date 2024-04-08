import path from "path";
import webpush from "web-push";
import { Workbook } from "exceljs";
import dataClient from "../data-client";
import { Status } from "@prisma/client";

export async function sendNotification(
  officeId: number,
  subject: string,
  description: string
) {
  const officers = await dataClient.officers.findMany({
    where: {
      officeId: officeId,
    },
  });

  const payload = JSON.stringify({
    title: subject,
    body: description,
    icon: "https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png",
  });

  officers.forEach((officer) => {
    if (officer.device)
      webpush
        .sendNotification(JSON.parse(officer.device), payload)
        .catch((err) => console.error(err));
  });
}

export function getDocumentStatus(referrals: Status[]) {
  const ongoing = referrals.filter(
    (ref) => ref !== Status.FINISHED && ref !== Status.NOT_ACTIONABLE
  ).length;

  if (ongoing > 0) return `${ongoing} Ongoing`;
  return "Finished";
}

export async function generateReport() {
  const workbook = new Workbook();

  // Get offices performances
  const offices = await dataClient.offices.findMany({
    select: {
      id: true,
      name: true,
      referrals: {
        select: {
          status: {
            select: {
              category: true,
            },
          },
        },
      },
    },
  });

  const statistics = offices.map((office) => ({
    office: office.name,
    referred: office.referrals.length,
    closed: office.referrals.filter(
      (ref) => ref.status?.category === Status.FINISHED
    ).length,
    ongoing: office.referrals.filter(
      (ref) =>
        ref.status?.category !== Status.FINISHED &&
        ref.status?.category !== Status.NOT_ACTIONABLE
    ).length,
    noaction: office.referrals.filter(
      (ref) => ref.status?.category === Status.NOT_ACTIONABLE
    ).length,
  }));

  // Document Statistics Sheet
  const statSheet = workbook.addWorksheet("Statistics");

  statSheet.columns = [
    { key: "office", header: "Office" },
    { key: "referred", header: "Referred" },
    { key: "closed", header: "Closed" },
    { key: "ongoing", header: "Ongoing" },
    { key: "noaction", header: "No Action" },
  ];

  statSheet.addRows(statistics);

  // Set column colors
  statSheet.columns.forEach((column) => {
    column.width = 20;

    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
        if (rowNumber === 1) {
          // Header row color
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFA500" }, // Orange
          };
        }

        if (rowNumber === statistics.length + 1) {
          // Data row color
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" }, // Yellow
          };
        }
      });
    }
  });

  // Get document status
  const documents = await dataClient.documents.findMany({
    select: {
      referenceNum: true,
      subject: true,
      dateCreated: true,
      receivedFrom: true,
      tag: true,
      referrals: {
        select: {
          office: {
            select: {
              name: true,
            },
          },
          status: {
            select: {
              category: true,
            },
          },
        },
      },
    },
  });

  const statuses = documents.map((doc) => ({
    referenceNum: doc.referenceNum,
    subject: doc.subject,
    dateCreated: doc.dateCreated,
    receivedFrom: doc.receivedFrom,
    referredTo: doc.referrals.map((ref) => ref.office.name).join(", "),
    status: getDocumentStatus(
      doc.referrals.map((ref) =>
        ref.status ? ref.status.category : Status.NOT_ACTIONABLE
      )
    ),
    tag: doc.tag,
  }));

  // Documents Sheet
  const documentSheet = workbook.addWorksheet("Documents");

  documentSheet.columns = [
    { key: "referenceNum", header: "Reference Slip" },
    { key: "subject", header: "Subject" },
    { key: "dateCreated", header: "Date" },
    { key: "receivedFrom", header: "Received From" },
    { key: "referredTo", header: "Referred To" },
    { key: "status", header: "Status" },
    { key: "tag", header: "Remarks" },
  ];

  documentSheet.addRows(statuses);

  // Set column colors
  documentSheet
    .getColumn(1)
    .eachCell({ includeEmpty: true }, function (cell, rowNumber) {
      if (rowNumber === 1) {
        // Header row color
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFA500" }, // Orange
        };
      } else {
        // Data row color
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" }, // Yellow
        };
      }
    });

  // Set header colors
  documentSheet.columns.forEach((column) => {
    column.width = 30;

    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, function (cell, rowNumber) {
        if (rowNumber === 1) {
          // Header row color
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFA500" }, // Orange
          };
        }
      });
    }
  });

  // save the workbook to a local directory
  const filename = `${new Date().getTime().toFixed(0)}.xlsx`;
  await workbook.xlsx.writeFile(
    path.join(__dirname, "..", "uploads", filename)
  );

  // return download url
  return `${process.env.BASE_MEDIA_URL}/${filename}`;
}
