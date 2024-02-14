import { Reports, Status, SubmittedReports } from "@prisma/client";
import { GraphQLError } from "graphql";
import dataClient from "../data-client";
import pubsub from "../pubsub";

const resolvers = {
    Reports: {
        id: (parent: Reports) => {
            return parent.id.toString();
        },

        localDue: (parent: Reports) => {
            return new Date(parent.localDue).toISOString();
        },

        nationalDue: (parent: Reports) => {
            return new Date(parent.nationalDue).toISOString();
        }
    },

    SubmittedReports: {
        id: (parent: SubmittedReports) => {
            return parent.id.toString();
        },

        report: async (parent: SubmittedReports) => {
            return await dataClient.reports.findUnique({
                where: {
                    id: parent.reportId
                }
            })
        },

        office: async (parent: SubmittedReports) => {
            return await dataClient.offices.findUnique({
                where: {
                    id: parent.officeId
                }
            })
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
        }
    },

    Query: {
        getReports: async () => {
            return await dataClient.reports.findMany({
                orderBy: {
                    name: 'asc'
                }
            })
        },

        getReportById: async (_: unknown, args: Reports) => {
            return await dataClient.reports.findUnique({
                where: {
                    id: args.id
                }
            })
        },

        getSubmittedReports: async (_: unknown, args: { officeId?: number }) => {
            return await dataClient.submittedReports.findMany({
                where: {
                    officeId: args.officeId
                },
                orderBy: {
                    dateCreated: 'desc'
                }
            })
        },

        getSubmittedReportById: async (_: unknown, args: Reports) => {
            return await dataClient.submittedReports.findUnique({
                where: {
                    id: args.id
                }
            })
        },

        getReportSummary: async () => {
            const summary = await dataClient.submittedReports.groupBy({
                by: ['officeId', 'status'],
                _count: {
                    _all: true
                }
            });

            const offices = await dataClient.offices.findMany();

            return offices.map(office => ({
                office: office.name,
                total: summary.filter(stat => stat.officeId === office.id).reduce((sum, stat) => sum + parseInt(stat._count._all.toString()), 0),
                submitted: summary.filter(stat => stat.officeId === office.id && stat.status === "FINISHED").reduce((sum, stat) => sum + parseInt(stat._count._all.toString()), 0),
                pending: summary.filter(stat => stat.officeId === office.id && stat.status === "ONGOING").reduce((sum, stat) => sum + parseInt(stat._count._all.toString()), 0)
            }))
        },

        getReportStatistics: async (_: unknown, args: { officeId?: number }) => {
            const statistics = await dataClient.submittedReports.groupBy({
                by: ['status'],
                where: {
                    officeId: args.officeId
                },
                _count: {
                    _all: true
                }
            });

            const overdue = await dataClient.submittedReports.aggregate({
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
                    status: Status.ONGOING
                },
                _count: {
                    _all: true
                }
            });

            return {
                total: statistics.reduce((total, report) => total + report._count._all, 0),
                submitted: statistics.find(stats => stats.status === Status.FINISHED)?._count._all || 0,
                pending: statistics.find(stats => stats.status === Status.ONGOING)?._count._all || 0,
                overdue: overdue._count._all
            }
        }
    },

    Mutation: {
        createReport: async (_: unknown, args: Reports) => {
            const report = await dataClient.reports.create({
                data: {
                    name: args.name,
                    basis: args.basis,
                    localDue: new Date(args.localDue),
                    nationalDue: new Date(args.nationalDue),
                    frequency: args.frequency
                }
            });

            const offices = await dataClient.offices.findMany({
                select: {
                    id: true
                }
            });

            pubsub.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `CREATED_REPORT_${report.name}`,
                    eventDate: new Date().toISOString()
                }
            })

            for (let i = 0; i < offices.length; i++) {
                const office = offices[i];
                await dataClient.submittedReports.create({
                    data: {
                        reportId: report.id,
                        officeId: office.id,
                        localDue: new Date(args.localDue),
                        nationalDue: new Date(args.nationalDue),
                        status: Status.ONGOING
                    }
                });

                // trigger create report event
                pubsub.publish(`OFFICE_${office.id.toString()}`, {
                    officeEvents: {
                        eventName: `CREATED_REPORT_${report.name}`,
                        eventDate: new Date().toISOString()
                    }
                })
            }

            return report;
        },

        updateReport: async (_: unknown, args: Reports) => {
            // get current report deadline
            const report = await dataClient.reports.findUnique({
                where: {
                    id: args.id
                },
                select: {
                    localDue: true,
                    nationalDue: true
                }
            });

            if (!report) throw new GraphQLError('Report does not exist', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
            });

            // update report deadline
            const updated = await dataClient.reports.update({
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
            await dataClient.submittedReports.updateMany({
                where: {
                    localDue: report.localDue,
                    nationalDue: report.nationalDue
                },
                data: {
                    localDue: new Date(args.localDue),
                    nationalDue: new Date(args.nationalDue),
                }
            })

            // trigger update report event
            pubsub.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `UPDATED_REPORT_${updated.name}`,
                    eventDate: new Date().toISOString()
                }
            })

            for (let i = 0; i < updated.submitted.length; i++) {
                const office = updated.submitted[i];

                // trigger update report event
                pubsub.publish(`OFFICE_${office.officeId.toString()}`, {
                    officeEvents: {
                        eventName: `UPDATED_REPORT_${updated.name}`,
                        eventDate: new Date().toISOString()
                    }
                })
            }

            return updated;
        },

        deleteReport: async (_: unknown, args: Reports) => {
            const deleted = await dataClient.reports.delete({
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
            })

            pubsub.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `DELETED_REPORT_${deleted.name}`,
                    eventDate: new Date().toISOString()
                }
            })

            for (let i = 0; i < deleted.submitted.length; i++) {
                const office = deleted.submitted[i];

                // trigger delete report event
                pubsub.publish(`OFFICE_${office.officeId.toString()}`, {
                    officeEvents: {
                        eventName: `DELETED_REPORT_${deleted.name}`,
                        eventDate: new Date().toISOString()
                    }
                })
            }

            return deleted;
        },

        submitReport: async (_: unknown, args: { id: number, message: string, files: string[] }) => {
            const submitted = await dataClient.submittedReports.update({
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
            })

            pubsub.publish('OFFICE_ADMIN', {
                officeEvents: {
                    eventName: `SUBMITTED_REPORT_${submitted.report.name}`,
                    eventDate: new Date().toISOString()
                }
            })

            pubsub.publish(`OFFICE_${submitted.office.id.toString()}`, {
                officeEvents: {
                    eventName: `SUBMITTED_REPORT_${submitted.report.name}`,
                    eventDate: new Date().toISOString()
                }
            });
            
            return submitted;
        }
    }
};

export default resolvers;