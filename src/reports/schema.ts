import { gql } from 'graphql-tag';

const schema = gql`

    enum Frequency {
        NONE
        WEEKLY
        MONTHLY
        YEARLY
    }

    type Reports {
        id: String!
        name: String!
        basis: String!
        localDue: String!
        nationalDue: String!
        frequency: Frequency!
    }

    type ReportSummary {
        office: String!
        total: Int!
        submitted: Int!
        pending: Int!
    }

    type ReportStatistics {
        total: Int!
        submitted: Int!
        pending: Int!
        overdue: Int!
    }

    type SubmittedReports {
        id: String!
        report: Reports!
        office: Offices!
        dateCreated: String!
        localDue: String!
        nationalDue: String!
        message: String
        files: [String!]
        status: Status!
    }

    extend type Query {
        getReports: [Reports!]!
        getReportById(id: Int!): Reports!
        getSubmittedReports(officeId: Int): [SubmittedReports!]!
        getSubmittedReportById(id: Int!): SubmittedReports!
        getReportStatistics(officeId: Int): ReportStatistics!
        getReportSummary: [ReportSummary!]!
    }

    extend type Mutation {
        createReport(name: String!, basis: String!, localDue: String!, nationalDue: String!, frequency: Frequency!): Reports!
        updateReport(id: Int!, name: String!, basis: String!, localDue: String!, nationalDue: String!, frequency: Frequency!): Reports!
        deleteReport(id: Int!): Reports!

        submitReport(id: Int!, message: String, files: [String!]): SubmittedReports!
    }
`;

export default schema;