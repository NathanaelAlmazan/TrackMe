import { gql } from "graphql-tag";

const schema = gql`
  enum Frequency {
    NONE
    MONTHLY
    QUARTERLY
    SEMESTRAL
    YEARLY
  }

  enum EventType {
    EVENT
    HR_REPORT
    ADMIN_REPORT
    DOCUMENT
  }

  type Events {
    id: String!
    subject: String!
    description: String!
    date: String!
    image: String
    dateDue: String
    frequency: Frequency!
    type: EventType
    scope: [Offices]
  }

  enum ReportType {
    HR
    ADMIN
  }

  type Reports {
    id: String!
    name: String!
    basis: String!
    localDue: String!
    nationalDue: String!
    frequency: Frequency!
    type: ReportType!
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
    pending: Int!
  }

  extend type Query {
    getReports: [Reports!]!
    getReportById(id: Int!): Reports!
    getSubmittedReports(officeId: Int): [SubmittedReports!]!
    getSubmittedReportById(id: Int!): SubmittedReports!
    getOfficeSubmissions(id: Int!): [SubmittedReports!]!
    getReportStatistics(officeId: Int): ReportStatistics!
    getReportSummary: [ReportSummary!]!
    getEvents(date: String!, officeId: Int): [Events!]!
    getEventById(id: Int!): Events!
  }

  extend type Mutation {
    createReport(
      name: String!
      basis: String!
      localDue: String!
      nationalDue: String!
      frequency: Frequency!
      type: ReportType!
    ): Reports!
    updateReport(
      id: Int!
      name: String
      basis: String
      localDue: String
      nationalDue: String
      frequency: Frequency
      type: ReportType
    ): Reports!
    deleteReport(id: Int!): Reports!

    submitReport(id: Int!, message: String, files: [String!]): SubmittedReports!

    createSubmission(
      reportId: Int!
      localDue: String!
      nationalDue: String!
    ): Reports!
    deleteSubmission(id: Int!): SubmittedReports!

    createEvent(
      subject: String!
      description: String!
      image: String
      date: String!
      frequency: Frequency!
      scope: [Int]
    ): Events!
    updateEvent(
      id: Int!
      subject: String
      description: String
      image: String
      date: String
      frequency: Frequency
      scope: [Int]
    ): Events!
    deleteEvent(id: Int!): Events!
  }
`;

export default schema;
