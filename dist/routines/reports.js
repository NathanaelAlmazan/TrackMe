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
exports.autoGenerateReports = exports.nextDate = void 0;
const client_1 = require("@prisma/client");
const data_client_1 = __importDefault(require("../data-client"));
const pubsub_1 = __importDefault(require("../pubsub"));
function nextDate(date, frequency) {
    switch (frequency) {
        case client_1.Frequency.MONTHLY:
            return new Date(date.setMonth(date.getMonth() + 1));
        case client_1.Frequency.YEARLY:
            return new Date(date.setFullYear(date.getFullYear() + 1));
        default:
            return date;
    }
}
exports.nextDate = nextDate;
function autoGenerateReports() {
    return __awaiter(this, void 0, void 0, function* () {
        // get reports that pass the deadline
        const reports = yield data_client_1.default.reports.findMany({
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
        const offices = yield data_client_1.default.offices.findMany({
            select: {
                id: true,
            },
        });
        for (let i = 0; i < reports.length; i++) {
            const report = reports[i];
            const nextLocalDeadline = nextDate(report.localDue, report.frequency);
            const nextNationalDeadline = nextDate(report.nationalDue, report.frequency);
            for (let i = 0; i < offices.length; i++) {
                const office = offices[i];
                // generate new submission
                yield data_client_1.default.submittedReports.create({
                    data: {
                        reportId: report.id,
                        officeId: office.id,
                        localDue: nextLocalDeadline,
                        nationalDue: nextNationalDeadline,
                        status: client_1.Status.REFERRED,
                    },
                });
                // update report next due date
                yield data_client_1.default.reports.update({
                    where: {
                        id: report.id,
                    },
                    data: {
                        localDue: nextLocalDeadline,
                        nationalDue: nextNationalDeadline,
                    },
                });
                // trigger create report event
                pubsub_1.default.publish(`OFFICE_${office.id.toString()}`, {
                    officeEvents: {
                        eventName: `CREATED_REPORT_${report.name}`,
                        eventDate: new Date().toISOString(),
                    },
                });
            }
        }
    });
}
exports.autoGenerateReports = autoGenerateReports;
//# sourceMappingURL=reports.js.map