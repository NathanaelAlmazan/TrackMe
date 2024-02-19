import { Officers, Offices, Positions, Role, Status } from "@prisma/client";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import dataClient from "../data-client";

const resolvers = {
    Positions: {
        id: (parent: Positions) => {
            return parent.id.toString();
        }
    },

    Offices: {
        id: (parent: Offices) => {
            return parent.id.toString();
        },

        officers: async (parent: Offices) => {
            return await dataClient.officers.findMany({
                where: {
                    officeId: parent.id
                },
                orderBy: {
                    lastName: 'asc'
                }
            })
        },

        reports: async (parent: Offices, args: { complied?: boolean }) => {
            return await dataClient.submittedReports.findMany({
                where: {
                    officeId: parent.id,
                    status: args.complied ? 'FINISHED' : 'ONGOING'
                }
            })
        }
    },

    Officers: {
        position: async (parent: Officers) => {
            if (!parent.positionId) return null;

            return await dataClient.positions.findUnique({
                where: {
                    id: parent.positionId
                }
            })
        },

        office: async (parent: Officers) => {
            if (!parent.officeId) return null;

            return await dataClient.offices.findUnique({
                where: {
                    id: parent.officeId
                }
            })
        }
    },

    Query: {
        getPositions: async () => {
            return await dataClient.positions.findMany({
                orderBy: {
                    role: 'asc'
                }
            })
        },

        getOffices: async () => {
            return await dataClient.offices.findMany({
                orderBy: {
                    name: 'asc'
                }
            })
        },

        getOfficers: async () => {
            return await dataClient.officers.findMany({
                orderBy: {
                    firstName: 'asc'
                }
            })
        },

        getSignatories: async () => {
            return await dataClient.officers.findMany({
                where: {
                    position: {
                        role: Role.DIRECTOR
                    }
                },
                orderBy: {
                    firstName: 'asc'
                }
            })
        },

        getOfficerById: async (_: unknown, args: Officers) => {
            return await dataClient.officers.findUnique({
                where: {
                    uuid: args.uuid
                }
            })
        },

        loginOfficer: async (_: unknown, args: Officers) => {
            const { firstName, lastName, password } = args;

            const officer = await dataClient.officers.findFirst({
                where: {
                    firstName: firstName,
                    lastName: lastName,
                    active: true
                }
            });

            if (!officer) throw new GraphQLError('Account does not exist or inactive.', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
            });

            // verify password
            if (await bcrypt.compare(password, officer.password)) return officer;
            else throw new GraphQLError('You entered a wrong password.', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
            });
        },

        getNotifications: async (_: unknown, args: { uuid: string }) => {
            // get officer
            const officer = await dataClient.officers.findUnique({
                where: {
                    uuid: args.uuid
                }
            });

            if (!officer || !officer.officeId) throw new GraphQLError('Officer does not exist', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
            });

            // get document notifications
            const documents = await dataClient.documents.findMany({
                where: {
                    referrals: {
                        some: {
                            officeId: officer.officeId
                        }
                    },
                    status: {
                        category: Status.NOT_STARTED
                    }
                }
            });

            const reports: { name: string, dateCreated: Date, localDue: Date }[] = await dataClient.$queryRaw`
                SELECT rp."name", sr."dateCreated", sr."localDue" FROM public."SubmittedReports" sr
                INNER JOIN public."Reports" rp ON rp.id = sr."reportId"
                WHERE (sr."localDue" - INTERVAL '20 days') < CURRENT_TIMESTAMP
                AND sr."officeId" = ${officer.officeId}`;

            return documents.map(document => ({
                subject: 'Assigned Document',
                description: `Document ${document.referenceNum} has been assigned to your office for completion by ${new Date(document.dateDue).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    weekday: 'short'
                })}`,
                timestamp: new Date(document.dateCreated).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    weekday: 'short'
                })
            })).concat(reports.map(report => ({
                subject: 'Due Report',
                description: `Please submit ${report.name} before ${new Date(report.dateCreated).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    weekday: 'short'
                })}`,
                timestamp: new Date(report.dateCreated).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    weekday: 'short'
                })
            })));
        }
    },

    Mutation: {
        createPosition: async (_: unknown, args: Positions) => {
            return await dataClient.positions.create({
                data: {
                    label: args.label,
                    role: args.role
                }
            })
        },

        updatePosition: async (_: unknown, args: Positions) => {
            return await dataClient.positions.update({
                where: {
                    id: args.id
                },
                data: {
                    label: args.label,
                    role: args.role
                }
            })
        },

        deletePosition: async (_: unknown, args: Positions) => {
            return await dataClient.positions.delete({
                where: {
                    id: args.id
                }
            })
        },

        // ============================== OFFICES ===================================

        createOffice: async (_: unknown, args: Offices) => {
            const { name } = args;

            return await dataClient.offices.create({
                data: {
                    name: name
                }
            })
        },

        updateOffice: async (_: unknown, args: Offices) => {
            const { id, name } = args;

            return await dataClient.offices.update({
                where: {
                    id: id
                },
                data: {
                    name: name
                }
            })
        },

        deleteOffice: async (_: unknown, args: Offices) => {
            const { id } = args;

            return await dataClient.offices.delete({
                where: {
                    id: id
                }
            })
        },

        // ============================== OFFICERS ===================================

        createOfficer: async (_: unknown, args: Officers) => {
            const { firstName, lastName, positionId, officeId, password } = args;

            return await dataClient.officers.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    officeId: officeId,
                    positionId: positionId,
                    password: await bcrypt.hash(password, 12)
                }
            })
        },

        updateOfficer: async (_: unknown, args: Officers) => {
            const { uuid, avatar, firstName, lastName, positionId, officeId, password, signature } = args;
            
            return await dataClient.officers.update({
                where: {
                    uuid: uuid
                },
                data: {
                    avatar: avatar,
                    firstName: firstName,
                    lastName: lastName,
                    officeId: officeId,
                    positionId: positionId,
                    password: password ? await bcrypt.hash(password, 12) : undefined,
                    signature: signature
                }
            })
        },

        deleteOfficer: async (_: unknown, args: Officers) => {
            const { uuid } = args;

            return await dataClient.officers.delete({
                where: {
                    uuid: uuid
                }
            })
        },

        activateOfficer: async (_: unknown, args: Officers) => {
            const { uuid, active } = args;

            return await dataClient.officers.update({
                where: {
                    uuid: uuid
                },
                data: {
                    active: active
                }
            })
        }
    }
}

export default resolvers;