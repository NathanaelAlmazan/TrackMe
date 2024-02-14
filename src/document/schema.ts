import { gql } from 'graphql-tag';

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

    type Documents {
        referenceNum: String!
        subject: String!
        description: String!
        receivedFrom: String!
        type: DocumentTypes
        purpose: DocumentPurpose
        status: DocumentStatus
        tag: Tags
        dateCreated: String!
        dateDue: String!
        refferedTo: [Offices!]!
        comments: [Comments!]!
        
    }

    type Comments {
        id: String!
        message: String!
        files: [String!]
        sender: Officers!
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
        updateDocumentStatus(id: Int!, label: String!, category: Status!): DocumentStatus!
        deleteDocumentStatus(id: Int!): DocumentStatus!

        createDocument(
            subject: String!
            description: String!
            receivedFrom: String!
            typeId: Int!
            purposeId: Int!
            statusId: Int!
            tag: Tags
            dateDue: String!
            refferedTo: [Int!]!
        ): Documents!

        updateDocument(
            referenceNum: String!
            subject: String
            description: String
            receivedFrom: String
            typeId: Int
            purposeId: Int
            statusId: Int
            tag: Tags
            dateDue: String
            refferedTo: [Int]
        ): Documents!

        documentUpdateStatus(referenceNum: String!, statusId: Int!): DocumentStatus!
        deleteDocument(referenceNum: String!): Documents!

        createComment(documentId: String!, senderId: String!, message: String!, files: [String!]): Comments!
    }

    extend type Subscription {
        officeEvents(officeId: Int): DocumentEvent!
        documentEvents(referenceNum: String!): DocumentEvent!
    }
`

export default schema;