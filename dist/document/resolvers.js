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
const web_push_1 = __importDefault(require("web-push"));
const data_client_1 = __importDefault(require("../data-client"));
const pubsub_1 = __importDefault(require("../pubsub"));
const documents_1 = require("../routines/documents");
const graphql_1 = require("graphql");
const resolvers = {
    DocumentStatus: {
        id: (parent) => {
            return parent.id.toString();
        },
    },
    DocumentTypes: {
        id: (parent) => {
            return parent.id.toString();
        },
    },
    DocumentPurpose: {
        id: (parent) => {
            return parent.id.toString();
        },
    },
    Referrals: {
        office: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.offices.findUnique({
                where: {
                    id: parent.officeId,
                },
            });
        }),
        status: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (!parent.statusId)
                return null;
            return yield data_client_1.default.documentStatus.findUnique({
                where: {
                    id: parent.statusId,
                },
            });
        }),
        assigned: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.assigned.findMany({
                where: {
                    documentId: parent.documentId,
                    officer: {
                        officeId: parent.officeId,
                    },
                },
            });
        }),
    },
    Documents: {
        type: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (!parent.typeId)
                return null;
            return yield data_client_1.default.documentTypes.findUnique({
                where: {
                    id: parent.typeId,
                },
            });
        }),
        purpose: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (!parent.purposeId)
                return null;
            return yield data_client_1.default.documentPurpose.findUnique({
                where: {
                    id: parent.purposeId,
                },
            });
        }),
        signatory: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (!parent.signatureId)
                return null;
            return yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: parent.signatureId,
                },
            });
        }),
        dateCreated: (parent) => {
            return parent.dateCreated.toISOString();
        },
        dateDue: (parent) => {
            return parent.dateDue.toISOString();
        },
        status: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const referrals = yield data_client_1.default.referrals.findMany({
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
            if (referrals.filter((ref) => { var _a; return ((_a = ref.status) === null || _a === void 0 ? void 0 : _a.category) === client_1.Status.NOT_ACTIONABLE; }).length > 0)
                return "Not Actionable";
            else
                return (0, documents_1.getDocumentStatus)(referrals.map((ref) => ref.status ? ref.status.category : client_1.Status.NOT_ACTIONABLE));
        }),
        referredTo: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const referrals = yield data_client_1.default.referrals.findMany({
                where: {
                    documentId: parent.referenceNum,
                },
            });
            return referrals;
        }),
        assigned: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            const officer = yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: args.officerId,
                },
                select: {
                    officeId: true,
                },
            });
            if (!officer || !officer.officeId)
                return [];
            const assigned = yield data_client_1.default.assigned.findMany({
                where: {
                    documentId: parent.referenceNum,
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
        }),
        comments: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.comments.findMany({
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
        }),
        recipients: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            const officer = yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: args.officerId,
                },
                select: {
                    position: {
                        select: {
                            role: true,
                        },
                    },
                    officeId: true,
                },
            });
            if (!officer || !officer.officeId || !officer.position)
                return [];
            if (officer.position.role === client_1.Role.SUPERUSER ||
                officer.position.role === client_1.Role.DIRECTOR)
                return data_client_1.default.officers.findMany({
                    where: {
                        position: {
                            role: client_1.Role.CHIEF,
                        },
                        office: {
                            referrals: {
                                some: {
                                    documentId: parent.referenceNum,
                                },
                            },
                        },
                    },
                });
            else if (officer.position.role === client_1.Role.CHIEF)
                return yield data_client_1.default.officers.findMany({
                    where: {
                        OR: [
                            {
                                position: {
                                    role: client_1.Role.DIRECTOR,
                                },
                            },
                            {
                                assigned: {
                                    some: {
                                        documentId: parent.referenceNum,
                                    },
                                },
                            },
                        ],
                    },
                });
            else
                return yield data_client_1.default.officers.findMany({
                    where: {
                        position: {
                            role: client_1.Role.CHIEF,
                        },
                        office: {
                            id: officer.officeId,
                            referrals: {
                                some: {
                                    documentId: parent.referenceNum,
                                },
                            },
                        },
                    },
                });
        }),
    },
    Comments: {
        id: (parent) => {
            return parent.id.toString();
        },
        sender: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: parent.sender,
                },
            });
        }),
        recipient: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: parent.recipient,
                },
            });
        }),
        dateCreated: (parent) => {
            return parent.dateCreated.toISOString();
        },
    },
    Query: {
        getDocumentTypes: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentTypes.findMany({
                orderBy: {
                    label: "asc",
                },
            });
        }),
        getDocumentPurposes: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentPurpose.findMany({
                orderBy: {
                    label: "asc",
                },
            });
        }),
        getDocumentStatus: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentStatus.findMany({
                orderBy: {
                    label: "asc",
                },
            });
        }),
        getDocuments: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const officer = yield data_client_1.default.officers.findUnique({
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
                throw new graphql_1.GraphQLError("Officer not found.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            if (officer.position.role === client_1.Role.SUPERUSER ||
                officer.position.role === client_1.Role.DIRECTOR)
                return yield data_client_1.default.documents.findMany({
                    orderBy: {
                        dateCreated: "asc",
                    },
                });
            else if (officer.position.role === client_1.Role.CHIEF)
                return data_client_1.default.documents.findMany({
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
                return data_client_1.default.documents.findMany({
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
        }),
        getDocumentById: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documents.findUnique({
                where: {
                    referenceNum: args.referenceNum,
                },
            });
        }),
        getTempReferenceNum: () => __awaiter(void 0, void 0, void 0, function* () {
            // get current count
            const today = new Date();
            const document = yield data_client_1.default.documents.findFirst({
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
            let serial = document
                ? document.referenceNum.split("-")[3]
                : "00000";
            return `RR6-${today.getFullYear()}-${today.getMonth() + 1}-${String(parseInt(serial) + 1).padStart(5, "0")}`;
        }),
        getDocumentSummary: () => __awaiter(void 0, void 0, void 0, function* () {
            const summary = yield data_client_1.default.$queryRaw `
                SELECT rfl."officeId", status.category, COUNT(*) 
                FROM public."Referrals" rfl
                INNER JOIN public."DocumentStatus" status
                ON status.id = rfl."statusId"
                GROUP BY rfl."officeId", status.category;`;
            const offices = yield data_client_1.default.offices.findMany();
            return offices.map((office) => ({
                office: office.name,
                referred: summary
                    .filter((stat) => stat.officeId === office.id)
                    .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                closed: summary
                    .filter((stat) => stat.officeId === office.id && stat.category === "FINISHED")
                    .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                ongoing: summary
                    .filter((stat) => stat.officeId === office.id &&
                    stat.category !== "NOT_ACTIONABLE" &&
                    stat.category !== "FINISHED")
                    .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                noaction: summary
                    .filter((stat) => stat.officeId === office.id && stat.category === "NOT_ACTIONABLE")
                    .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
            }));
        }),
        getDocumentStatistics: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            let statistics;
            if (args.officeId) {
                // statistics for each offices
                statistics = yield data_client_1.default.$queryRaw `
                    SELECT rfl."documentId", status.category, COUNT(*) 
                    FROM public."Referrals" rfl
                    INNER JOIN public."DocumentStatus" status
                    ON status.id = rfl."statusId"
                    WHERE rfl."officeId" = ${args.officeId}
                    GROUP BY rfl."documentId", status.category`;
            }
            else {
                // admin statistics
                statistics = yield data_client_1.default.$queryRaw `
                    SELECT rfl."documentId", status.category, COUNT(*) 
                    FROM public."Referrals" rfl
                    INNER JOIN public."DocumentStatus" status
                    ON status.id = rfl."statusId"
                    GROUP BY rfl."documentId", status.category;`;
            }
            return {
                referred: statistics.reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                closed: statistics
                    .filter((stat) => stat.category === "FINISHED")
                    .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                ongoing: statistics
                    .filter((stat) => stat.category !== "NOT_ACTIONABLE" && stat.category !== "FINISHED")
                    .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                noaction: statistics
                    .filter((stat) => stat.category === "NOT_ACTIONABLE")
                    .reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
            };
        }),
    },
    Mutation: {
        // ============================== DOCUMENT TYPES ===================================
        createDocumentType: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentTypes.create({
                data: {
                    label: args.label,
                },
            });
        }),
        updateDocumentType: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentTypes.update({
                where: {
                    id: args.id,
                },
                data: {
                    label: args.label,
                },
            });
        }),
        deleteDocumentType: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const types = yield data_client_1.default.documents.aggregate({
                where: {
                    typeId: args.id,
                },
                _count: true,
            });
            if (types._count > 0)
                throw new graphql_1.GraphQLError("There are active documents under this type.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            return yield data_client_1.default.documentTypes.delete({
                where: {
                    id: args.id,
                },
            });
        }),
        // ============================== DOCUMENT PURPOSES ===================================
        createDocumentPurpose: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentPurpose.create({
                data: {
                    label: args.label,
                },
            });
        }),
        updateDocumentPurpose: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentPurpose.update({
                where: {
                    id: args.id,
                },
                data: {
                    label: args.label,
                },
            });
        }),
        deleteDocumentPurpose: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const purposes = yield data_client_1.default.documents.aggregate({
                where: {
                    purposeId: args.id,
                },
                _count: true,
            });
            if (purposes._count > 0)
                throw new graphql_1.GraphQLError("There are active documents under this purpose.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            return yield data_client_1.default.documentPurpose.delete({
                where: {
                    id: args.id,
                },
            });
        }),
        // ============================== DOCUMENT STATUS ===================================
        createDocumentStatus: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentStatus.create({
                data: {
                    label: args.label,
                    category: args.category,
                },
            });
        }),
        updateDocumentStatus: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.documentStatus.update({
                where: {
                    id: args.id,
                },
                data: {
                    label: args.label,
                    category: args.category,
                },
            });
        }),
        deleteDocumentStatus: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield data_client_1.default.referrals.aggregate({
                where: {
                    statusId: args.id,
                },
                _count: true,
            });
            if (status._count > 0)
                throw new graphql_1.GraphQLError("There are active documents under this status.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            return yield data_client_1.default.documentStatus.delete({
                where: {
                    id: args.id,
                },
            });
        }),
        // ============================== DOCUMENTS ===================================
        createDocument: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { subject, description, receivedFrom, typeId, purposeId, signatureId, tag, dateDue, referredTo, } = args;
            // get current count
            const today = new Date();
            const document = yield data_client_1.default.documents.findFirst({
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
            let serial = document
                ? document.referenceNum.split("-")[3]
                : "00000";
            const referenceNum = `RR6-${today.getFullYear()}-${today.getMonth() + 1}-${String(parseInt(serial) + 1).padStart(5, "0")}`;
            // trigger created document event
            pubsub_1.default.publish("OFFICE_ADMIN", {
                officeEvents: {
                    eventName: `CREATED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            });
            // trigger assigned document event
            referredTo.forEach((ref) => pubsub_1.default.publish(`OFFICE_${ref.officeId.toString()}`, {
                officeEvents: {
                    eventName: `ASSIGNED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            }));
            // send notification
            referredTo.forEach((ref) => (0, documents_1.sendNotification)(ref.officeId, `Assigned Document ${referenceNum}`, subject));
            // get initial assigned
            const officers = yield data_client_1.default.officers.findMany({
                where: {
                    officeId: {
                        in: referredTo.map((ref) => ref.officeId),
                    },
                    position: {
                        role: client_1.Role.CHIEF,
                    },
                },
                select: {
                    uuid: true,
                },
            });
            // create new document
            return yield data_client_1.default.documents.create({
                data: {
                    referenceNum: referenceNum,
                    subject: subject,
                    description: description,
                    receivedFrom: receivedFrom,
                    typeId: typeId,
                    purposeId: purposeId,
                    signatureId: signatureId,
                    tag: tag,
                    dateDue: new Date(dateDue),
                    referrals: {
                        createMany: {
                            data: referredTo,
                        },
                    },
                    assigned: {
                        createMany: {
                            data: officers.map((officer) => ({
                                officerId: officer.uuid,
                                assignment: client_1.Assignment.APPROVER,
                            })),
                        },
                    },
                },
            });
        }),
        updateDocument: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { referenceNum, subject, description, receivedFrom, typeId, purposeId, signatureId, tag, dateDue, } = args;
            const referredTo = yield data_client_1.default.referrals.findMany({
                where: {
                    documentId: referenceNum,
                },
                select: {
                    officeId: true,
                },
            });
            // trigger updated document event
            pubsub_1.default.publish("OFFICE_ADMIN", {
                officeEvents: {
                    eventName: `UPDATED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            });
            // trigger reassigned document event
            referredTo.forEach((ref) => pubsub_1.default.publish(`OFFICE_${ref.officeId.toString()}`, {
                officeEvents: {
                    eventName: `UPDATED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            }));
            return yield data_client_1.default.documents.update({
                where: {
                    referenceNum: referenceNum,
                },
                data: {
                    subject: subject,
                    description: description,
                    receivedFrom: receivedFrom,
                    typeId: typeId,
                    purposeId: purposeId,
                    signatureId: signatureId,
                    tag: tag,
                    dateDue: new Date(dateDue),
                },
            });
        }),
        documentUpdateStatus: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const updated = yield data_client_1.default.referrals.update({
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
            pubsub_1.default.publish(`DOCUMENT_${args.referenceNum}`, {
                documentEvents: {
                    eventName: `UPDATED_DOCUMENT_${args.referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            });
            // trigger updated document event
            pubsub_1.default.publish("OFFICE_ADMIN", {
                officeEvents: {
                    eventName: `UPDATED_DOCUMENT_${args.referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            });
            // trigger updated document event
            pubsub_1.default.publish(`OFFICE_${args.officeId.toString()}`, {
                officeEvents: {
                    eventName: `UPDATED_DOCUMENT_${args.referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            });
            // send notifications
            const recipients = yield data_client_1.default.officers.findMany({
                where: {
                    OR: [
                        {
                            position: {
                                role: client_1.Role.DIRECTOR,
                            },
                        },
                        {
                            officeId: args.officeId,
                        },
                    ],
                },
            });
            const payload = JSON.stringify({
                title: `${(_a = updated.status) === null || _a === void 0 ? void 0 : _a.label} ${args.referenceNum}`,
                body: `Document status changed to ${(_b = updated.status) === null || _b === void 0 ? void 0 : _b.label}`,
                icon: "https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png",
            });
            recipients.forEach((officer) => {
                if (officer.device)
                    web_push_1.default
                        .sendNotification(JSON.parse(officer.device), payload)
                        .catch((err) => console.error(err));
            });
            return updated.status;
        }),
        deleteDocument: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { referenceNum } = args;
            const deleted = yield data_client_1.default.documents.delete({
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
            // trigger created document event
            pubsub_1.default.publish("OFFICE_ADMIN", {
                officeEvents: {
                    eventName: `DELETED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            });
            // trigger assigned document event
            deleted.referrals.forEach((office) => pubsub_1.default.publish(`OFFICE_${office.officeId.toString()}`, {
                officeEvents: {
                    eventName: `DELETED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString(),
                },
            }));
            return deleted;
        }),
        createComment: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { senderId, recipientId, documentId, message } = args;
            // trigger updated document event
            pubsub_1.default.publish(`DOCUMENT_${documentId}`, {
                documentEvents: {
                    eventName: `ADDED_COMMENT_${documentId}`,
                    eventDate: new Date().toISOString(),
                },
            });
            return yield data_client_1.default.comments.create({
                data: {
                    documentId: documentId,
                    sender: senderId,
                    recipient: recipientId,
                    message: message,
                },
            });
        }),
        assignOfficers: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            // reset the assignments
            yield data_client_1.default.assigned.deleteMany({
                where: {
                    documentId: args.documentId,
                },
            });
            // save new assignments
            yield data_client_1.default.assigned.createMany({
                data: args.officerIds.map((officerId) => ({
                    documentId: args.documentId,
                    officerId: officerId,
                    assignment: client_1.Assignment.MEMBER,
                })),
            });
            // send notifications to assigned officers
            const recipients = yield data_client_1.default.officers.findMany({
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
                    web_push_1.default
                        .sendNotification(JSON.parse(officer.device), payload)
                        .catch((err) => console.error(err));
            });
            return yield data_client_1.default.documents.findUnique({
                where: {
                    referenceNum: args.documentId,
                },
            });
        }),
    },
    Subscription: {
        officeEvents: {
            subscribe: (officeId) => {
                if (!officeId)
                    return pubsub_1.default.asyncIterator(["OFFICE_ADMIN"]);
                return pubsub_1.default.asyncIterator([`OFFICE_${officeId.toString()}`]);
            },
        },
        documentEvents: {
            subscribe: (referenceNum) => {
                return pubsub_1.default.asyncIterator([`DOCUMENT_${referenceNum}`]);
            },
        },
    },
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map