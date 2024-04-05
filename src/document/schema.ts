import { gql } from "graphql-tag";

const schema = gql`
  enum Status {
    NOT_STARTED
    ONGOING
    FINISHED
    NOT_ACTIONABLE
  }

  enum Tags {
    CONFIDENTIAL
    TOP_PRIORITY
    FOLLOW_UP
  }

  type DocumentStatus {
    id: String!
    label: String!
    category: Status!
  }

  type DocumentTypes {
    id: String!
    label: String!
  }

  type DocumentPurpose {
    id: String!
    label: String!
  }

  type DocumentSummary {
    office: String!
    referred: Int!
    closed: Int!
    ongoing: Int!
    noaction: Int!
  }

  type DocumentStatistics {
    referred: Int!
    closed: Int!
    ongoing: Int!
    noaction: Int!
  }

  type Referrals {
    office: Offices!
    status: DocumentStatus!
    assigned: [Officers!]!
  }

  input ReferralInput {
    officeId: Int!
    statusId: Int!
  }

  type Documents {
    referenceNum: String!
    subject: String!
    description: String!
    receivedFrom: String!
    type: DocumentTypes
    purpose: DocumentPurpose
    tag: Tags
    dateCreated: String!
    dateDue: String!
    signatory: Officers!
    referredTo: [Referrals!]!
    comments: [Comments!]!
  }

  enum Assignment {
    APPROVER
    MEMBER
  }

  type Assigned {
    officer: Officers!
    assignment: Assignment!
  }

  type Comments {
    id: String!
    message: String!
    sender: Officers!
    recipient: Officers!
    dateCreated: String!
  }

  type DocumentEvent {
    eventName: String!
    eventDate: String!
  }

  extend type Query {
    getDocumentTypes: [DocumentTypes!]!
    getDocumentPurposes: [DocumentPurpose!]!
    getDocumentStatus: [DocumentStatus!]!
    getDocuments(officeId: Int): [Documents!]!
    getDocumentById(referenceNum: String!): Documents!
    getTempReferenceNum: String!
    getDocumentStatistics(officeId: Int): DocumentStatistics!
    getDocumentSummary: [DocumentSummary!]!
  }

  extend type Mutation {
    createDocumentType(label: String!): DocumentTypes!
    updateDocumentType(id: Int!, label: String!): DocumentTypes!
    deleteDocumentType(id: Int!): DocumentTypes!

    createDocumentPurpose(label: String!): DocumentPurpose!
    updateDocumentPurpose(id: Int!, label: String!): DocumentPurpose!
    deleteDocumentPurpose(id: Int!): DocumentPurpose!

    createDocumentStatus(label: String!, category: Status!): DocumentStatus!
    updateDocumentStatus(
      id: Int!
      label: String!
      category: Status!
    ): DocumentStatus!
    deleteDocumentStatus(id: Int!): DocumentStatus!

    createDocument(
      subject: String!
      description: String!
      receivedFrom: String!
      typeId: Int!
      purposeId: Int!
      tag: Tags
      dateDue: String!
      signatureId: String!
      referredTo: [ReferralInput!]!
    ): Documents!

    updateDocument(
      referenceNum: String!
      subject: String
      description: String
      receivedFrom: String
      typeId: Int
      purposeId: Int
      tag: Tags
      dateDue: String
      signatureId: String!
      referredTo: [ReferralInput]
    ): Documents!

    documentUpdateStatus(
      referenceNum: String!
      officeId: Int!
      statusId: Int!
    ): DocumentStatus!
    deleteDocument(referenceNum: String!): Documents!

    createComment(
      documentId: String!
      senderId: String!
      recipientId: String!
      message: String!
    ): Comments!

    assignOfficers(documentId: String!, officerIds: [String!]!): Documents!
  }

  extend type Subscription {
    officeEvents(officeId: Int): DocumentEvent!
    documentEvents(referenceNum: String!): DocumentEvent!
  }
`;

export default schema;
