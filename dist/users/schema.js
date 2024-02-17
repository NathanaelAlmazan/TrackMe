"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const schema = (0, graphql_tag_1.gql) `
    type Offices {
        id: String!
        name: String!
        officers: [Officers!]!
        reports(complied: Boolean): [SubmittedReports!]!
    }

    enum Role {
        OFFICER
        CHIEF
        DIRECTOR
        SUPERUSER
        HR_ADMIN
    }

    type Positions {
        id: String!
        label: String!
        role: Role!
    }

    type Officers {
        uuid: String!
        firstName: String!
        lastName: String!
        position: Positions
        office: Offices
        signature: String
        active: Boolean!
        avatar: String!
    }

    type Notifications {
        subject: String!
        description: String!
        timestamp: String!
    }

    extend type Query {
        getOffices: [Offices!]!
        getOfficers: [Officers!]!
        getPositions: [Positions!]!
        getSignatories: [Officers!]!
        loginOfficer(firstName: String!, lastName: String!, password: String!): Officers
        getOfficerById(uuid: String!): Officers
        getNotifications(uuid: String!): [Notifications!]!
    }

    extend type Mutation {
        createPosition(label: String!, role: Role!): Positions!
        updatePosition(id: Int!, label: String!, role: Role!): Positions!
        deletePosition(id: Int!): Positions!

        createOffice(name: String!): Offices!
        updateOffice(id: Int!, name: String): Offices!
        deleteOffice(id: Int!): Offices!

        createOfficer(firstName: String!, lastName: String!, positionId: Int!, officeId: Int!, password: String!): Officers!
        updateOfficer(uuid: String!, avatar: String, firstName: String, lastName: String, positionId: Int, officeId: Int, password: String, signature: String): Officers!
        deleteOfficer(uuid: String!): Officers!
        activateOfficer(uuid: String!, active: Boolean!): Officers!
    }
`;
exports.default = schema;
//# sourceMappingURL=schema.js.map