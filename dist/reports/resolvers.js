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
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const data_client_1 = __importDefault(require("../data-client"));
const pubsub_1 = __importDefault(require("../pubsub"));
const resolvers = {
    Events: {
        id: (parent) => {
            return parent.id.toString();
        },
        date: (parent) => {
            return new Date(parent.date).toISOString();
        },
        dateDue: (parent) => {
            if (!parent.dateDue)
                return null;
            return new Date(parent.dateDue).toISOString();
        },
    },
    Reports: {
        id: (parent) => {
            return parent.id.toString();
        },
        localDue: (parent) => {
            return new Date(parent.localDue).toISOString();
        },
        nationalDue: (parent) => {
            return new Date(parent.nationalDue).toISOString();
        }
    },
    SubmittedReports: {
        id: (parent) => {
            return parent.id.toString();
        },
        report: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.reports.findUnique({
                where: {
                    id: parent.reportId
                }
            });
        }),
        office: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.offices.findUnique({
                where: {
                    id: parent.officeId
                }
            });
        }),
        localDue: (parent) => {
            return new Date(parent.localDue).toISOString();
        },
        dateCreated: (parent) => {
            return new Date(parent.dateCreated).toISOString();
        },
        nationalDue: (parent) => {
            return new Date(parent.nationalDue).toISOString();
        },
        files: (parent) => {
            var _a;
            return (_a = parent.files) === null || _a === void 0 ? void 0 : _a.split(";");
        },
        pending: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const pending = yield data_client_1.default.submittedReports.aggregate({
                where: {
                    reportId: parent.reportId,
                    localDue: parent.localDue,
                    nationalDue: parent.nationalDue,
                    status: client_1.Status.ONGOING
                },
                _count: true
            });
            return pending._count;
        })
    },
    Query: {
        getReports: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.reports.findMany({
                orderBy: {
                    name: 'asc'
                }
            });
        }),
        getReportById: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const submitted = yield data_client_1.default.submittedReports.findUnique({
                where: {
                    id: args.id
                },
                include: {
                    report: true
                }
            });
            if (!submitted)
                throw new graphql_1.GraphQLError('Report does not exist', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            return Object.assign(Object.assign({}, submitted.report), { localDue: submitted.localDue, nationalDue: submitted.nationalDue });
        }),
        getSubmittedReports: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (args.officeId)
                return yield data_client_1.default.submittedReports.findMany({
                    where: {
                        officeId: args.officeId
                    },
                    orderBy: {
                        dateCreated: 'desc'
                    }
                });
            return data_client_1.default.$queryRaw `SELECT DISTINCT ON ("reportId", "localDue", "nationalDue") * FROM public."SubmittedReports"`;
        }),
        getSubmittedReportById: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.submittedReports.findUnique({
                where: {
                    id: args.id
                }
            });
        }),
        getOfficeSubmissions: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const report = yield data_client_1.default.submittedReports.findUnique({
                where: {
                    id: args.id
                }
            });
            if (!report)
                throw new graphql_1.GraphQLError('Report does not exist', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            return yield data_client_1.default.submittedReports.findMany({
                where: {
                    reportId: report.reportId,
                    localDue: report.localDue,
                    nationalDue: report.nationalDue
                },
                orderBy: {
                    dateCreated: 'desc'
                }
            });
        }),
        getReportSummary: () => __awaiter(void 0, void 0, void 0, function* () {
            const summary = yield data_client_1.default.submittedReports.groupBy({
                by: ['officeId', 'status'],
                _count: {
                    _all: true
                }
            });
            const offices = yield data_client_1.default.offices.findMany();
            return offices.map(office => ({
                office: office.name,
                total: summary.filter(stat => stat.officeId === office.id).reduce((sum, stat) => sum + parseInt(stat._count._all.toString()), 0),
                submitted: summary.filter(stat => stat.officeId === office.id && stat.status === "FINISHED").reduce((sum, stat) => sum + parseInt(stat._count._all.toString()), 0),
                pending: summary.filter(stat => stat.officeId === office.id && stat.status === "ONGOING").reduce((sum, stat) => sum + parseInt(stat._count._all.toString()), 0)
            }));
        }),
        getReportStatistics: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const statistics = yield data_client_1.default.submittedReports.groupBy({
                by: ['status'],
                where: {
                    officeId: args.officeId
                },
                _count: {
                    _all: true
                }
            });
            const overdue = yield data_client_1.default.submittedReports.aggregate({
                where: {
                    OR: [
                        {
                            localDue: {
                                lt: new Date()
                            }
                        },
                        {
                            nationalDue: {
                                lt: new Date()
                            }
                        }
                    ],
                    status: client_1.Status.ONGOING,
                    officeId: args.officeId
                },
                _count: {
                    _all: true
                }
            });
            return {
                total: statistics.reduce((total, report) => total + report._count._all, 0),
                submitted: ((_a = statistics.find(stats => stats.status === client_1.Status.FINISHED)) === null || _a === void 0 ? void 0 : _a._count._all) || 0,
                pending: ((_b = statistics.find(stats => stats.status === client_1.Status.ONGOING)) === null || _b === void 0 ? void 0 : _b._count._all) || 0,
                overdue: overdue._count._all
            };
        }),
        getEvents: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const today = new Date(args.date).toISOString().split('T')[0];
            // get events
            const events = yield data_client_1.default.$queryRaw `SELECT *
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
            const reports = yield data_client_1.default.$queryRaw `SELECT *
                            FROM public."Reports"
                            WHERE (
                                    EXTRACT(MONTH FROM "localDue") = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND "frequency" = 'YEARLY'
                                ) OR (
                                    EXTRACT(MONTH FROM "localDue") = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND EXTRACT(YEAR FROM "localDue") = EXTRACT(YEAR FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                    AND "frequency" = 'NONE'
                                ) OR "frequency" = 'MONTHLY'`;
            const documents = yield data_client_1.default.$queryRaw `SELECT *
                                FROM public."Documents" doc
                                INNER JOIN public."DocumentStatus" status ON status.id = doc."statusId"
                                WHERE status.category != 'NOT_ACTIONABLE'
                                AND EXTRACT(MONTH FROM "dateDue") = EXTRACT(MONTH FROM TO_DATE(${today}, 'YYYY-MM-DD'))
                                AND EXTRACT(YEAR FROM "dateDue") = EXTRACT(YEAR FROM TO_DATE(${today}, 'YYYY-MM-DD'))`;
            // get submissions
            const submissions = yield data_client_1.default.$queryRaw `SELECT DISTINCT ON (sub."reportId", sub."localDue", sub."nationalDue") 
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
            let assigned = [];
            if (args.officeId) {
                const office = yield data_client_1.default.offices.findUnique({
                    where: {
                        id: args.officeId
                    },
                    include: {
                        referrals: {
                            select: {
                                documentId: true
                            }
                        }
                    }
                });
                if (office)
                    assigned = office.referrals.map(ref => ref.documentId);
            }
            return events.map(event => ({
                id: event.id.toString(),
                subject: event.subject,
                description: event.description,
                date: new Date(event.date).toISOString(),
                dateDue: '',
                frequency: event.frequency,
                type: "EVENT"
            })).concat(reports.filter(report => !submissions.find(sub => sub.reportId === report.id)).map(report => ({
                id: '',
                subject: report.name,
                description: report.basis,
                date: new Date(report.localDue).toISOString(),
                dateDue: new Date(report.nationalDue).toISOString(),
                frequency: report.frequency,
                type: report.type === 'HR' ? "HR_REPORT" : "ADMIN_REPORT"
            }))).concat(documents.filter(document => assigned.includes(document.referenceNum) || !args.officeId).map(document => ({
                id: document.referenceNum,
                subject: document.referenceNum,
                description: document.subject,
                date: new Date(document.dateDue).toISOString(),
                dateDue: '',
                frequency: "NONE",
                type: "DOCUMENT"
            }))).concat(submissions.map(submit => ({
                id: submit.id.toString(),
                subject: submit.name,
                description: submit.basis,
                date: new Date(submit.localDue).toISOString(),
                dateDue: new Date(submit.nationalDue).toISOString(),
                frequency: "NONE",
                type: submit.type === 'HR' ? "HR_REPORT" : "ADMIN_REPORT"
            })));
        }),
        getEventById: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.events.findUnique({
                where: {
                    id: args.id
                }
            });
        })
    },
    Mutation: {
        // ============================== EVENTS ===================================
        createEvent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.events.create({
                data: {
                    subject: args.subject,
                    description: args.description,
                    date: args.date,
                    frequency: args.frequency
                }
            });
        }),
        updateEvent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.events.update({
                where: {
                    id: args.id
                },
                data: {
                    subject: args.subject,
                    description: args.description,
                    date: args.date,
                    frequency: args.frequency
                }
            });
        }),
        deleteEvent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.events.delete({
                where: {
                    id: args.id
                }
            });
        }),
        // ============================== REPORTS ===================================
        createReport: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const report = yield data_client_1.default.reports.create({
                data: {
                    name: args.name,
                    basis: args.basis,
                    localDue: new Date(args.localDue),
                    nationalDue: new Date(args.nationalDue),
                    frequency: args.frequency,
                    type: args.type
                }
            });
            const offices = yield data_client_1.default.offices.findMany({
                select: {
                    id: true
                }
            });
            pubsub_1.default.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `CREATED_REPORT_${report.name}`,
                    eventDate: new Date().toISOString()
                }
            });
            for (let i = 0; i < offices.length; i++) {
                const office = offices[i];
                yield data_client_1.default.submittedReports.create({
                    data: {
                        reportId: report.id,
                        officeId: office.id,
                        localDue: new Date(args.localDue),
                        nationalDue: new Date(args.nationalDue),
                        status: client_1.Status.ONGOING
                    }
                });
                // trigger create report event
                pubsub_1.default.publish(`OFFICE_${office.id.toString()}`, {
                    officeEvents: {
                        eventName: `CREATED_REPORT_${report.name}`,
                        eventDate: new Date().toISOString()
                    }
                });
            }
            return report;
        }),
        updateReport: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            // get current report deadline
            const report = yield data_client_1.default.submittedReports.findUnique({
                where: {
                    id: args.id
                },
                select: {
                    reportId: true,
                    localDue: true,
                    nationalDue: true
                }
            });
            if (!report)
                throw new graphql_1.GraphQLError('Report does not exist', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            // update report deadline
            const updated = yield data_client_1.default.reports.update({
                where: {
                    id: report.reportId
                },
                data: {
                    name: args.name,
                    basis: args.basis,
                    frequency: args.frequency,
                    type: args.type
                },
                include: {
                    submitted: {
                        select: {
                            officeId: true
                        }
                    }
                }
            });
            // update latest report submissions
            yield data_client_1.default.submittedReports.updateMany({
                where: {
                    localDue: report.localDue,
                    nationalDue: report.nationalDue
                },
                data: {
                    localDue: new Date(args.localDue),
                    nationalDue: new Date(args.nationalDue),
                }
            });
            // trigger update report event
            pubsub_1.default.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `UPDATED_REPORT_${updated.name}`,
                    eventDate: new Date().toISOString()
                }
            });
            for (let i = 0; i < updated.submitted.length; i++) {
                const office = updated.submitted[i];
                // trigger update report event
                pubsub_1.default.publish(`OFFICE_${office.officeId.toString()}`, {
                    officeEvents: {
                        eventName: `UPDATED_REPORT_${updated.name}`,
                        eventDate: new Date().toISOString()
                    }
                });
            }
            return updated;
        }),
        deleteReport: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const deleted = yield data_client_1.default.reports.delete({
                where: {
                    id: args.id
                },
                include: {
                    submitted: {
                        select: {
                            officeId: true
                        }
                    }
                }
            });
            pubsub_1.default.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `DELETED_REPORT_${deleted.name}`,
                    eventDate: new Date().toISOString()
                }
            });
            for (let i = 0; i < deleted.submitted.length; i++) {
                const office = deleted.submitted[i];
                // trigger delete report event
                pubsub_1.default.publish(`OFFICE_${office.officeId.toString()}`, {
                    officeEvents: {
                        eventName: `DELETED_REPORT_${deleted.name}`,
                        eventDate: new Date().toISOString()
                    }
                });
            }
            return deleted;
        }),
        submitReport: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const submitted = yield data_client_1.default.submittedReports.update({
                where: {
                    id: args.id
                },
                data: {
                    status: "FINISHED",
                    message: args.message,
                    files: args.files.join(';')
                },
                include: {
                    report: {
                        select: {
                            name: true
                        }
                    },
                    office: {
                        select: {
                            id: true
                        }
                    }
                }
            });
            pubsub_1.default.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `SUBMITTED_REPORT_${submitted.report.name}`,
                    eventDate: new Date().toISOString()
                }
            });
            pubsub_1.default.publish(`OFFICE_${submitted.office.id.toString()}`, {
                officeEvents: {
                    eventName: `SUBMITTED_REPORT_${submitted.report.name}`,
                    eventDate: new Date().toISOString()
                }
            });
            return submitted;
        }),
        // =============================== SUBMISSIONS ==================================
        createSubmission: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const report = yield data_client_1.default.reports.findUnique({
                where: {
                    id: args.reportId
                }
            });
            if (!report)
                throw new graphql_1.GraphQLError('Report does not exist', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            const offices = yield data_client_1.default.offices.findMany({
                select: {
                    id: true
                }
            });
            pubsub_1.default.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `CREATED_REPORT_${report.name}`,
                    eventDate: new Date().toISOString()
                }
            });
            for (let i = 0; i < offices.length; i++) {
                const office = offices[i];
                yield data_client_1.default.submittedReports.create({
                    data: {
                        reportId: report.id,
                        officeId: office.id,
                        localDue: new Date(args.localDue),
                        nationalDue: new Date(args.nationalDue),
                        status: client_1.Status.ONGOING
                    }
                });
                // trigger create report event
                pubsub_1.default.publish(`OFFICE_${office.id.toString()}`, {
                    officeEvents: {
                        eventName: `CREATED_REPORT_${report.name}`,
                        eventDate: new Date().toISOString()
                    }
                });
            }
            return report;
        }),
        deleteSubmission: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const submission = yield data_client_1.default.submittedReports.findUnique({
                where: {
                    id: args.id
                }
            });
            yield data_client_1.default.submittedReports.deleteMany({
                where: {
                    reportId: submission === null || submission === void 0 ? void 0 : submission.reportId,
                    localDue: submission === null || submission === void 0 ? void 0 : submission.localDue,
                    nationalDue: submission === null || submission === void 0 ? void 0 : submission.nationalDue
                }
            });
            return submission;
        })
    },
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map