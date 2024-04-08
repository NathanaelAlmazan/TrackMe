"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = exports.getDocumentStatus = exports.sendNotification = void 0;
const path_1 = __importDefault(require("path"));
const web_push_1 = __importDefault(require("web-push"));
const exceljs_1 = require("exceljs");
const data_client_1 = __importDefault(require("../data-client"));
const client_1 = require("@prisma/client");
function sendNotification(officeId, subject, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const officers = yield data_client_1.default.officers.findMany({
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
                web_push_1.default
                    .sendNotification(JSON.parse(officer.device), payload)
                    .catch((err) => console.error(err));
        });
    });
}
exports.sendNotification = sendNotification;
function getDocumentStatus(referrals) {
    const ongoing = referrals.filter((ref) => ref !== client_1.Status.FINISHED && ref !== client_1.Status.NOT_ACTIONABLE).length;
    if (ongoing > 0)
        return `${ongoing} Ongoing`;
    return "Finished";
}
exports.getDocumentStatus = getDocumentStatus;
function generateReport() {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.Workbook();
        // Get offices performances
        const offices = yield data_client_1.default.offices.findMany({
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
            closed: office.referrals.filter((ref) => { var _a; return ((_a = ref.status) === null || _a === void 0 ? void 0 : _a.category) === client_1.Status.FINISHED; }).length,
            ongoing: office.referrals.filter((ref) => {
                var _a, _b;
                return ((_a = ref.status) === null || _a === void 0 ? void 0 : _a.category) !== client_1.Status.FINISHED &&
                    ((_b = ref.status) === null || _b === void 0 ? void 0 : _b.category) !== client_1.Status.NOT_ACTIONABLE;
            }).length,
            noaction: office.referrals.filter((ref) => { var _a; return ((_a = ref.status) === null || _a === void 0 ? void 0 : _a.category) === client_1.Status.NOT_ACTIONABLE; }).length,
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
        const documents = yield data_client_1.default.documents.findMany({
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
            status: getDocumentStatus(doc.referrals.map((ref) => ref.status ? ref.status.category : client_1.Status.NOT_ACTIONABLE)),
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
            }
            else {
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
        yield workbook.xlsx.writeFile(path_1.default.join(__dirname, "..", "uploads", filename));
        // return download url
        return `${process.env.BASE_MEDIA_URL}/${filename}`;
    });
}
exports.generateReport = generateReport;
//# sourceMappingURL=documents.js.map