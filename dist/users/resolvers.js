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
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_client_1 = __importDefault(require("../data-client"));
const resolvers = {
    Positions: {
        id: (parent) => {
            return parent.id.toString();
        }
    },
    Offices: {
        id: (parent) => {
            return parent.id.toString();
        },
        officers: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findMany({
                where: {
                    officeId: parent.id
                },
                orderBy: {
                    lastName: 'asc'
                }
            });
        }),
        reports: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.submittedReports.findMany({
                where: {
                    officeId: parent.id,
                    status: args.complied ? 'FINISHED' : 'ONGOING'
                }
            });
        })
    },
    Officers: {
        position: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (!parent.positionId)
                return null;
            return yield data_client_1.default.positions.findUnique({
                where: {
                    id: parent.positionId
                }
            });
        }),
        office: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (!parent.officeId)
                return null;
            return yield data_client_1.default.offices.findUnique({
                where: {
                    id: parent.officeId
                }
            });
        })
    },
    Query: {
        getPositions: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.positions.findMany({
                orderBy: {
                    role: 'asc'
                }
            });
        }),
        getOffices: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.offices.findMany({
                orderBy: {
                    name: 'asc'
                }
            });
        }),
        getOfficers: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findMany({
                orderBy: {
                    firstName: 'asc'
                }
            });
        }),
        getSignatories: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findMany({
                where: {
                    position: {
                        role: client_1.Role.DIRECTOR
                    }
                },
                orderBy: {
                    firstName: 'asc'
                }
            });
        }),
        getOfficerById: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: args.uuid
                }
            });
        }),
        loginOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { firstName, lastName, password } = args;
            const officer = yield data_client_1.default.officers.findFirst({
                where: {
                    firstName: firstName,
                    lastName: lastName,
                    active: true
                }
            });
            if (!officer)
                return null;
            // verify password
            if (yield bcrypt_1.default.compare(password, officer.password))
                return officer;
            else
                return null;
        }),
        getNotifications: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            // get officer
            const officer = yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: args.uuid
                }
            });
            if (!officer || !officer.officeId)
                throw new graphql_1.GraphQLError('Officer does not exist', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            // get document notifications
            const documents = yield data_client_1.default.documents.findMany({
                where: {
                    referrals: {
                        some: {
                            officeId: officer.officeId
                        }
                    },
                    status: {
                        category: client_1.Status.NOT_STARTED
                    }
                }
            });
            const reports = yield data_client_1.default.$queryRaw `
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
        })
    },
    Mutation: {
        createPosition: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.positions.create({
                data: {
                    label: args.label,
                    role: args.role
                }
            });
        }),
        updatePosition: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.positions.update({
                where: {
                    id: args.id
                },
                data: {
                    label: args.label,
                    role: args.role
                }
            });
        }),
        deletePosition: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.positions.delete({
                where: {
                    id: args.id
                }
            });
        }),
        // ============================== OFFICES ===================================
        createOffice: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { name } = args;
            return yield data_client_1.default.offices.create({
                data: {
                    name: name
                }
            });
        }),
        updateOffice: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { id, name } = args;
            return yield data_client_1.default.offices.update({
                where: {
                    id: id
                },
                data: {
                    name: name
                }
            });
        }),
        deleteOffice: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = args;
            return yield data_client_1.default.offices.delete({
                where: {
                    id: id
                }
            });
        }),
        // ============================== OFFICERS ===================================
        createOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { firstName, lastName, positionId, officeId, password } = args;
            return yield data_client_1.default.officers.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    officeId: officeId,
                    positionId: positionId,
                    password: yield bcrypt_1.default.hash(password, 12)
                }
            });
        }),
        updateOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { uuid, avatar, firstName, lastName, positionId, officeId, password, signature } = args;
            return yield data_client_1.default.officers.update({
                where: {
                    uuid: uuid
                },
                data: {
                    avatar: avatar,
                    firstName: firstName,
                    lastName: lastName,
                    officeId: officeId,
                    positionId: positionId,
                    password: password ? yield bcrypt_1.default.hash(password, 12) : undefined,
                    signature: signature
                }
            });
        }),
        deleteOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { uuid } = args;
            return yield data_client_1.default.officers.delete({
                where: {
                    uuid: uuid
                }
            });
        }),
        activateOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { uuid, active } = args;
            return yield data_client_1.default.officers.update({
                where: {
                    uuid: uuid
                },
                data: {
                    active: active
                }
            });
        })
    }
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map