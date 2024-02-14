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
        }
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
            return yield data_client_1.default.reports.findUnique({
                where: {
                    id: args.id
                }
            });
        }),
        getSubmittedReports: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.submittedReports.findMany({
                where: {
                    officeId: args.officeId
                },
                orderBy: {
                    dateCreated: 'desc'
                }
            });
        }),
        getSubmittedReportById: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.submittedReports.findUnique({
                where: {
                    id: args.id
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
                    status: client_1.Status.ONGOING
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
        })
    },
    Mutation: {
        createReport: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const report = yield data_client_1.default.reports.create({
                data: {
                    name: args.name,
                    basis: args.basis,
                    localDue: new Date(args.localDue),
                    nationalDue: new Date(args.nationalDue),
                    frequency: args.frequency
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
            const report = yield data_client_1.default.reports.findUnique({
                where: {
                    id: args.id
                },
                select: {
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
                    id: args.id
                },
                data: {
                    name: args.name,
                    basis: args.basis,
                    localDue: new Date(args.localDue),
                    nationalDue: new Date(args.nationalDue),
                    frequency: args.frequency
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
        })
    }
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map