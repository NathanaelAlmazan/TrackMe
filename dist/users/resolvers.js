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
exports.BIN_OFFICE = void 0;
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_client_1 = __importDefault(require("../data-client"));
const smtp_1 = require("../utils/smtp");
const dates_1 = require("../utils/dates");
const documents_1 = require("../routines/documents");
exports.BIN_OFFICE = 20;
const resolvers = {
    Positions: {
        id: (parent) => {
            return parent.id.toString();
        },
    },
    Offices: {
        id: (parent) => {
            return parent.id.toString();
        },
        officers: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findMany({
                where: {
                    officeId: parent.id,
                },
                orderBy: {
                    lastName: "asc",
                },
            });
        }),
        reports: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.submittedReports.findMany({
                where: {
                    officeId: parent.id,
                    status: args.complied ? "FINISHED" : "REFERRED",
                },
            });
        }),
    },
    Officers: {
        position: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (!parent.positionId)
                return null;
            return yield data_client_1.default.positions.findUnique({
                where: {
                    id: parent.positionId,
                },
            });
        }),
        office: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            if (!parent.officeId)
                return null;
            return yield data_client_1.default.offices.findUnique({
                where: {
                    id: parent.officeId,
                },
            });
        }),
    },
    Query: {
        generateReport: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, documents_1.generateReport)();
        }),
        getPositions: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.positions.findMany({
                orderBy: {
                    role: "asc",
                },
            });
        }),
        getOffices: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.offices.findMany({
                where: {
                    id: {
                        not: exports.BIN_OFFICE,
                    }
                },
                orderBy: {
                    name: "asc",
                },
            });
        }),
        getOfficers: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findMany({
                where: {
                    AND: [
                        {
                            officeId: {
                                in: args.officeId
                            },
                        },
                        {
                            officeId: {
                                not: exports.BIN_OFFICE,
                            }
                        }
                    ]
                },
                orderBy: {
                    firstName: "asc",
                },
            });
        }),
        getSignatories: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findMany({
                where: {
                    position: {
                        role: client_1.Role.DIRECTOR,
                    },
                },
                orderBy: {
                    firstName: "asc",
                },
            });
        }),
        getOfficerById: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: args.uuid,
                },
            });
        }),
        loginOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, password } = args;
            // check username provided
            let officer = null;
            if (username.includes("@")) {
                const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
                if (!emailRegex.test(username))
                    throw new graphql_1.GraphQLError("Invalid email address.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                officer = yield data_client_1.default.officers.findUnique({
                    where: {
                        email: username,
                        active: true,
                    },
                });
            }
            else {
                const startIndex = username.indexOf("9");
                if (startIndex < 0)
                    throw new graphql_1.GraphQLError("Invalid phone number.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                const phoneNumber = username.substring(startIndex, username.length);
                if (phoneNumber.length !== 10 || !/^\d+$/.test(username))
                    throw new graphql_1.GraphQLError("Invalid phone number.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                officer = yield data_client_1.default.officers.findUnique({
                    where: {
                        phone: phoneNumber,
                        active: true,
                    },
                });
            }
            if (!officer || !officer.password)
                throw new graphql_1.GraphQLError("Account does not exist or inactive.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            // verify password
            if (yield bcrypt_1.default.compare(password, officer.password))
                return officer;
            else
                throw new graphql_1.GraphQLError("You entered a wrong password.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
        }),
        getNotifications: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            // get officer
            const officer = yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: args.uuid,
                },
                include: {
                    position: {
                        select: {
                            role: true,
                        },
                    },
                },
            });
            if (!officer || !officer.officeId)
                throw new graphql_1.GraphQLError("Officer does not exist", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            const events = yield data_client_1.default.$queryRaw `
                SELECT * FROM public."Events"
                WHERE (
                        EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP)
                        AND EXTRACT(DAY FROM date) = EXTRACT(DAY FROM CURRENT_TIMESTAMP)
                        AND frequency = 'YEARLY'
                    ) OR (
                        EXTRACT(DAY FROM date) = EXTRACT(DAY FROM CURRENT_TIMESTAMP)
                        AND frequency = 'MONTHLY'
                    ) OR (
                        EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP)
                        AND EXTRACT(DAY FROM date) = EXTRACT(DAY FROM CURRENT_TIMESTAMP)
                        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_TIMESTAMP)
                        AND frequency = 'NONE'
                    )`;
            if (((_a = officer.position) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.DIRECTOR) {
                const documents = yield data_client_1.default.documents.findMany({
                    where: {
                        dateDue: {
                            lt: new Date(),
                        },
                        referrals: {
                            some: {
                                AND: [
                                    {
                                        status: {
                                            category: {
                                                not: client_1.Status.FINISHED,
                                            },
                                        },
                                    },
                                    {
                                        status: {
                                            category: {
                                                not: client_1.Status.NOT_ACTIONABLE,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                });
                const submissions = yield data_client_1.default.submittedReports.findMany({
                    where: {
                        localDue: {
                            lt: new Date(),
                        },
                        AND: [
                            {
                                status: {
                                    not: client_1.Status.FINISHED,
                                },
                            },
                            {
                                status: {
                                    not: client_1.Status.NOT_ACTIONABLE,
                                },
                            },
                        ],
                    },
                    include: {
                        report: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });
                const reports = yield data_client_1.default.reports.findMany({
                    where: {
                        id: {
                            in: Array.from(new Set(submissions.map((sub) => sub.reportId))),
                        },
                    },
                });
                const submitted = yield data_client_1.default.referrals.findMany({
                    where: {
                        status: {
                            category: client_1.Status.SUBMITTED,
                        },
                    },
                    include: {
                        document: {
                            select: {
                                referenceNum: true,
                            },
                        },
                        office: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });
                return documents
                    .map((document) => ({
                    subject: "Overdue Document",
                    description: `Document ${document.referenceNum} is ${document.dateDue && (0, dates_1.getDayDiff)(document.dateDue)} days overdue.`,
                    timestamp: new Date().toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                    }),
                }))
                    .concat(submitted.map((sub) => ({
                    subject: "Submitted Document",
                    description: `${sub.office.name} submitted ${sub.document.referenceNum} for your review.`,
                    timestamp: new Date().toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                    }),
                })))
                    .concat(reports.map((report) => {
                    const offices = submissions.filter((sub) => sub.reportId === report.id);
                    const overdue = offices[0].localDue;
                    return {
                        subject: "Due Report",
                        description: `${report.name} is ${(0, dates_1.getDayDiff)(overdue)} days overdue. Waiting for ${offices.length} offices.`,
                        timestamp: new Date(overdue).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                        }),
                    };
                }))
                    .concat(events.map((event) => ({
                    subject: "Event",
                    description: event.subject,
                    timestamp: new Date(event.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                    }),
                })));
            }
            else if (((_b = officer.position) === null || _b === void 0 ? void 0 : _b.role) === client_1.Role.OFFICER) {
                const documents = yield data_client_1.default.assigned.findMany({
                    where: {
                        officerId: args.uuid,
                    },
                    include: {
                        document: {
                            select: {
                                referenceNum: true,
                                dateCreated: true,
                                dateDue: true,
                            },
                        },
                    },
                });
                return documents
                    .map((document) => ({
                    subject: "Assigned Document",
                    description: document.document.dateDue
                        ? `Document ${document.document.referenceNum} has been assigned to your office for completion by ${new Date(document.document.dateDue).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                        })}`
                        : `Document ${document.document.referenceNum} has been assigned to your office`,
                    timestamp: new Date(document.document.dateCreated).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                    }),
                }))
                    .concat(events.map((event) => ({
                    subject: "Event",
                    description: event.subject,
                    timestamp: new Date(event.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                    }),
                })));
            }
            // get document notifications
            const documents = yield data_client_1.default.documents.findMany({
                where: {
                    referrals: {
                        some: {
                            officeId: officer.officeId,
                            AND: [
                                {
                                    status: {
                                        category: {
                                            not: client_1.Status.FINISHED,
                                        },
                                    },
                                },
                                {
                                    status: {
                                        category: {
                                            not: client_1.Status.NOT_ACTIONABLE,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            });
            const reports = yield data_client_1.default.$queryRaw `
                SELECT rp."name", sr."dateCreated", sr."localDue" FROM public."SubmittedReports" sr
                INNER JOIN public."Reports" rp ON rp.id = sr."reportId"
                WHERE (sr."localDue" - INTERVAL '7 days') < CURRENT_TIMESTAMP
                AND sr."status" = 'REFERRED'
                AND sr."officeId" = ${officer.officeId}`;
            return documents
                .map((document) => ({
                subject: "Assigned Document",
                description: document.dateDue
                    ? `Document ${document.referenceNum} has been assigned to your office for completion by ${new Date(document.dateDue).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                    })}`
                    : `Document ${document.referenceNum} has been assigned to your office`,
                timestamp: new Date(document.dateCreated).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                }),
            }))
                .concat(reports.map((report) => ({
                subject: "Due Report",
                description: `Please submit ${report.name} before ${new Date(report.localDue).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                })}`,
                timestamp: new Date(report.dateCreated).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                }),
            })))
                .concat(events.map((event) => ({
                subject: "Event",
                description: event.subject,
                timestamp: new Date(event.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                }),
            })));
        }),
        requestResetPassword: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (!args.email && !args.phone)
                throw new graphql_1.GraphQLError("Please provide email or phone.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            // find officer
            const officer = yield data_client_1.default.officers.findFirst({
                where: {
                    OR: [
                        {
                            email: args.email,
                        },
                        {
                            phone: args.phone,
                        },
                    ],
                },
            });
            if (!officer)
                throw new graphql_1.GraphQLError("Account does not exist.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            // generate code
            const code = (0, smtp_1.generateSixDigitCode)();
            yield data_client_1.default.officers.update({
                where: {
                    uuid: officer.uuid,
                },
                data: {
                    code: code,
                },
            });
            // send code
            try {
                if (args.email) {
                    const subject = "Reset Password";
                    const message = "A unique code to reset your password has been generated for you.";
                    const content = (0, smtp_1.compileContent)(officer.firstName, code, message);
                    yield (0, smtp_1.sendEmail)(args.email, subject, content);
                    return args.email;
                }
                else if (args.phone) {
                    const message = `${code} is your reset password code.`;
                    yield (0, smtp_1.sendSms)(args.phone, message);
                    return args.phone;
                }
            }
            catch (err) {
                throw new graphql_1.GraphQLError("Failed to send reset code.", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                    },
                });
            }
        }),
        confirmResetPassword: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (!args.email && !args.phone)
                throw new graphql_1.GraphQLError("Please provide email or phone.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            // find officer
            const officer = yield data_client_1.default.officers.findFirst({
                where: {
                    OR: [
                        {
                            email: args.email,
                            code: args.code,
                        },
                        {
                            phone: args.phone,
                            code: args.code,
                        },
                    ],
                },
            });
            if (!officer)
                throw new graphql_1.GraphQLError("You entered a wrong code.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            // update password
            return yield data_client_1.default.officers.update({
                where: {
                    uuid: officer.uuid,
                },
                data: {
                    password: yield bcrypt_1.default.hash(args.password, 10),
                    code: null,
                },
            });
        }),
        requestAccountVerify: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { uuid, contact } = args;
            // check username provided
            let email = null;
            let phone = null;
            if (contact.includes("@")) {
                const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
                if (!emailRegex.test(contact))
                    throw new graphql_1.GraphQLError("Invalid email address.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                email = contact;
            }
            else {
                const startIndex = contact.indexOf("9");
                if (startIndex < 0)
                    throw new graphql_1.GraphQLError("Invalid phone number.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                const phoneNumber = contact.substring(startIndex, contact.length);
                if (phoneNumber.length !== 10 || !/^\d+$/.test(contact))
                    throw new graphql_1.GraphQLError("Invalid phone number.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                phone = phoneNumber;
            }
            if (!email && !phone)
                throw new graphql_1.GraphQLError("Please provide email or phone number.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            // find officer
            const officer = yield data_client_1.default.officers.findUnique({
                where: {
                    uuid: uuid,
                },
            });
            if (!officer)
                throw new graphql_1.GraphQLError("Account does not exist.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            try {
                // generate code
                const code = (0, smtp_1.generateSixDigitCode)();
                yield data_client_1.default.officers.update({
                    where: {
                        uuid: officer.uuid,
                    },
                    data: {
                        code: code,
                        email: email,
                        phone: phone,
                    },
                });
                // send code
                try {
                    if (email) {
                        const subject = "Account Verification";
                        const message = "A unique code to verify your account has been generated for you.";
                        const content = (0, smtp_1.compileContent)(officer.firstName, code, message);
                        yield (0, smtp_1.sendEmail)(email, subject, content);
                        return email;
                    }
                    else if (phone) {
                        const message = `${code} is your account verification code.`;
                        yield (0, smtp_1.sendSms)(phone, message);
                        return phone;
                    }
                }
                catch (err) {
                    throw new graphql_1.GraphQLError("Failed to send reset code.", {
                        extensions: {
                            code: "INTERNAL_SERVER_ERROR",
                        },
                    });
                }
            }
            catch (err) {
                throw new graphql_1.GraphQLError("Email or phone number is already used.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            }
        }),
        confirmAccountVerify: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { contact, code } = args;
            // check username provided
            let email = null;
            let phone = null;
            if (contact.includes("@")) {
                const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
                if (!emailRegex.test(contact))
                    throw new graphql_1.GraphQLError("Invalid email address.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                email = contact;
            }
            else {
                const startIndex = contact.indexOf("9");
                if (startIndex < 0)
                    throw new graphql_1.GraphQLError("Invalid phone number.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                const phoneNumber = contact.substring(startIndex, contact.length);
                if (phoneNumber.length !== 10 || !/^\d+$/.test(contact))
                    throw new graphql_1.GraphQLError("Invalid phone number.", {
                        extensions: {
                            code: "BAD_USER_INPUT",
                        },
                    });
                phone = phoneNumber;
            }
            if (!email && !phone)
                throw new graphql_1.GraphQLError("Please provide email or phone number.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            // find officer
            const officer = yield data_client_1.default.officers.findFirst({
                where: {
                    OR: [
                        {
                            email: email,
                            code: code,
                        },
                        {
                            phone: phone,
                            code: code,
                        },
                    ],
                },
            });
            if (!officer)
                throw new graphql_1.GraphQLError("Account does not exist.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            // verify account
            return yield data_client_1.default.officers.update({
                where: {
                    uuid: officer.uuid,
                },
                data: {
                    verified: true,
                    code: null,
                },
            });
        }),
    },
    Mutation: {
        createPosition: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.positions.create({
                data: {
                    label: args.label,
                    role: args.role,
                },
            });
        }),
        updatePosition: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield data_client_1.default.positions.update({
                where: {
                    id: args.id,
                },
                data: {
                    label: args.label,
                    role: args.role,
                },
            });
        }),
        deletePosition: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const positions = yield data_client_1.default.officers.aggregate({
                where: {
                    positionId: args.id,
                },
                _count: true,
            });
            if (positions._count > 0)
                throw new graphql_1.GraphQLError("There are active officers under this position.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            return yield data_client_1.default.positions.delete({
                where: {
                    id: args.id,
                },
            });
        }),
        // ============================== OFFICES ===================================
        createOffice: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { name } = args;
            return yield data_client_1.default.offices.create({
                data: {
                    name: name,
                },
            });
        }),
        updateOffice: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { id, name } = args;
            return yield data_client_1.default.offices.update({
                where: {
                    id: id,
                },
                data: {
                    name: name,
                },
            });
        }),
        deleteOffice: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = args;
            const officers = yield data_client_1.default.officers.aggregate({
                where: {
                    officeId: args.id,
                },
                _count: true,
            });
            if (officers._count > 0)
                throw new graphql_1.GraphQLError("There are active officers under this office.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            return yield data_client_1.default.offices.delete({
                where: {
                    id: id,
                },
            });
        }),
        // ============================== OFFICERS ===================================
        createOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { firstName, lastName, positionId, officeId, email, phone, password, } = args;
            try {
                const account = yield data_client_1.default.officers.findUnique({
                    where: {
                        firstName_lastName: {
                            firstName: firstName,
                            lastName: lastName,
                        },
                    },
                });
                if (account) {
                    return yield data_client_1.default.officers.update({
                        where: {
                            uuid: account.uuid,
                        },
                        data: {
                            firstName: firstName,
                            lastName: lastName,
                            officeId: officeId,
                            positionId: positionId,
                            email: email,
                            phone: phone,
                            password: password ? yield bcrypt_1.default.hash(password, 12) : null,
                        },
                    });
                }
                return yield data_client_1.default.officers.create({
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        officeId: officeId,
                        positionId: positionId,
                        email: email,
                        phone: phone,
                        password: password ? yield bcrypt_1.default.hash(password, 12) : null,
                    },
                });
            }
            catch (err) {
                console.log(err);
                throw new graphql_1.GraphQLError("Account already exists.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            }
        }),
        updateOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { uuid, avatar, firstName, lastName, positionId, officeId, password, signature, } = args;
            let email = !args.email ? undefined : args.email;
            let phone = !args.phone ? undefined : args.phone;
            try {
                return yield data_client_1.default.officers.update({
                    where: {
                        uuid: uuid,
                    },
                    data: {
                        avatar: avatar,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone,
                        officeId: officeId,
                        positionId: positionId,
                        password: password ? yield bcrypt_1.default.hash(password, 12) : undefined,
                        signature: signature,
                    },
                });
            }
            catch (err) {
                throw new graphql_1.GraphQLError("Email or phone number is already used.", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            }
        }),
        deleteOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { uuid } = args;
            yield data_client_1.default.comments.deleteMany({
                where: {
                    OR: [
                        {
                            sender: uuid,
                        },
                        {
                            recipient: uuid,
                        },
                    ],
                },
            });
            return yield data_client_1.default.officers.delete({
                where: {
                    uuid: uuid,
                },
            });
        }),
        activateOfficer: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { uuid, active } = args;
            return yield data_client_1.default.officers.update({
                where: {
                    uuid: uuid,
                },
                data: {
                    active: active,
                },
            });
        }),
    },
};
exports.default = resolvers;
//# sourceMappingURL=resolvers.js.map