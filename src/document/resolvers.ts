import { 
    Comments,
    DocumentPurpose, 
    DocumentStatus, 
    DocumentTypes, 
    Documents,
    Referrals,
    Role
} from "@prisma/client";
import dataClient from "../data-client";
import pubsub from "../pubsub";
import { sendNotification } from "../routines/documents";
import { GraphQLError } from "graphql";

interface DocumentInput extends Documents {
    referredTo: {
        officeId: number;
        statusId: number  | null;
        assignedId: string | null;
    }[]
}

interface CommentInput {
    documentId: string;
    senderId: string;
    message: string;
    level: Role;
    files: string[]
}

const resolvers = {
    DocumentStatus: {
        id: (parent: DocumentStatus) => {
            return parent.id.toString()
        }
    },

    DocumentTypes: {
        id: (parent: DocumentTypes) => {
            return parent.id.toString()
        }
    },

    DocumentPurpose: {
        id: (parent: DocumentPurpose) => {
            return parent.id.toString()
        }
    },

    Referrals: {
        office: async (parent: Referrals) => {
            return await dataClient.offices.findUnique({
                where: {
                    id: parent.officeId
                }
            })
        },

        status: async (parent: Referrals) => {
            if (!parent.statusId) return null;

            return await dataClient.documentStatus.findUnique({
                where: {
                    id: parent.statusId
                }
            })
        },

        assigned: async (parent: Referrals) => {
            if (!parent.assignedId) return null;

            return await dataClient.officers.findUnique({
                where: {
                    uuid: parent.assignedId
                }
            })
        },
    },

    Documents: {
        type: async (parent: Documents) => {
            if (!parent.typeId) return null;

            return await dataClient.documentTypes.findUnique({
                where: {
                    id: parent.typeId
                }
            })
        },

        purpose: async (parent: Documents) => {
            if (!parent.purposeId) return null;

            return await dataClient.documentPurpose.findUnique({
                where: {
                    id: parent.purposeId
                }
            })
        },

        signatory: async (parent: Documents) => {
            if (!parent.signatureId) return null;

            return await dataClient.officers.findUnique({
                where: {
                    uuid: parent.signatureId
                }
            })
        },

        dateCreated: (parent: Documents) => {
            return parent.dateCreated.toISOString()
        },

        dateDue: (parent: Documents) => {
            return parent.dateDue.toISOString()
        },

        referredTo: async (parent: Documents) => {
            const referrals = await dataClient.referrals.findMany({
                where: {
                    documentId: parent.referenceNum
                }
            });

            return referrals;
        },

        comments: async (parent: Documents) => {
            return await dataClient.comments.findMany({
                where: {
                    documentId: parent.referenceNum
                },
                orderBy: {
                    dateCreated: 'asc'
                }
            })
        }
    },

    Comments: {
        id: (parent: Comments) => {
            return parent.id.toString();
        },

        files: (parent: Comments) => {
            return parent.files.split(";");
        },
        
        sender: async (parent: Comments) => {
            return await dataClient.officers.findUnique({
                where: {
                    uuid: parent.senderId
                }
            })
        },

        dateCreated: (parent: Comments) => {
            return parent.dateCreated.toISOString()
        },
    },

    Query: {
        getDocumentTypes: async () => {
            return await dataClient.documentTypes.findMany({
                orderBy: {
                    label: 'asc'
                }
            })
        },

        getDocumentPurposes: async () => {
            return await dataClient.documentPurpose.findMany({
                orderBy: {
                    label: 'asc'
                }
            })
        },

        getDocumentStatus: async () => {
            return await dataClient.documentStatus.findMany({
                orderBy: {
                    label: 'asc'
                }
            })
        },

        getDocuments: async (_: unknown, args: { officeId?: number }) => {
            return await dataClient.documents.findMany({
                where: {
                    referrals: {
                        some: {
                            officeId: args.officeId
                        }
                    }
                },
                orderBy: {
                    dateCreated: 'asc'
                }
            })
        },

        getDocumentById: async (_: unknown, args: Documents) => {
            return await dataClient.documents.findUnique({
                where: {
                    referenceNum: args.referenceNum
                }
            })
        },

        getTempReferenceNum: async () => {
            // get current count
            const today = new Date();
            const document = await dataClient.documents.findFirst({
                where: {
                    dateCreated: {
                        gt: new Date(today.getFullYear(), today.getMonth(), 0)
                    }
                },
                orderBy: {
                    referenceNum: 'desc'
                },
                select: {
                    referenceNum: true
                }
            });

            // generate reference number
            let serial: string = document ? document.referenceNum.split('-')[3] : "00000";
            
            return `RR6-${today.getFullYear()}-${today.getMonth() + 1}-${String((parseInt(serial) + 1)).padStart(5, '0')}`;
        },

        getDocumentSummary: async () => {
            const summary: { officeId: BigInt, category: string, count: number }[] = await dataClient.$queryRaw`
                SELECT rfl."officeId", status.category, COUNT(*) 
                FROM public."Referrals" rfl
                INNER JOIN public."DocumentStatus" status
                ON status.id = rfl."statusId"
                GROUP BY rfl."officeId", status.category;`;

            const offices = await dataClient.offices.findMany();

            return offices.map(office => ({
                office: office.name,
                referred: summary.filter(stat => stat.officeId === office.id).reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                closed: summary.filter(stat => stat.officeId === office.id && stat.category === "FINISHED").reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                ongoing: summary.filter(stat => stat.officeId === office.id && (stat.category === "NOT_STARTED" || stat.category === "ONGOING")).reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                noaction: summary.filter(stat => stat.officeId === office.id && stat.category === "NOT_ACTIONABLE").reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0)
            }));
        },

        getDocumentStatistics: async (_: unknown, args: { officeId?: number }) => {
            let statistics: { documentId: string, category: string, count: BigInt }[];

            if (args.officeId) {
                // statistics for each offices
                statistics = await dataClient.$queryRaw`
                    SELECT rfl."documentId", status.category, COUNT(*) 
                    FROM public."Referrals" rfl
                    INNER JOIN public."DocumentStatus" status
                    ON status.id = rfl."statusId"
                    WHERE rfl."officeId" = ${args.officeId};
                    GROUP BY rfl."documentId", status.category;`;
            } else {
                // admin statistics
                statistics = await dataClient.$queryRaw`
                    SELECT rfl."documentId", status.category, COUNT(*) 
                    FROM public."Referrals" rfl
                    INNER JOIN public."DocumentStatus" status
                    ON status.id = rfl."statusId"
                    GROUP BY rfl."documentId", status.category;`;
            }

            return {
                referred: statistics.reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                closed: statistics.filter((stat) => stat.category === "FINISHED").reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                ongoing: statistics.filter((stat) => stat.category === "NOT_STARTED" || stat.category === "ONGOING").reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0),
                noaction: statistics.filter((stat) => stat.category === "NOT_ACTIONABLE").reduce((acc, stat) => acc + parseInt(stat.count.toString()), 0)
            }
        }
    },

    Mutation: {
        // ============================== DOCUMENT TYPES ===================================

        createDocumentType: async (_: unknown, args: DocumentTypes) => {
            return await dataClient.documentTypes.create({
                data: {
                    label: args.label
                }
            })
        },

        updateDocumentType: async (_: unknown, args: DocumentTypes) => {
            return await dataClient.documentTypes.update({
                where: {
                    id: args.id
                },
                data: {
                    label: args.label
                }
            })
        },

        deleteDocumentType: async (_: unknown, args: DocumentTypes) => {
            const types = await dataClient.documents.aggregate({
                where: {
                    typeId: args.id
                },
                _count: true
            });

            if (types._count > 0) throw new GraphQLError('There are active documents under this type.', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
            });

            return await dataClient.documentTypes.delete({
                where: {
                    id: args.id
                }
            })
        },

        // ============================== DOCUMENT PURPOSES ===================================

        createDocumentPurpose: async (_: unknown, args: DocumentPurpose) => {
            return await dataClient.documentPurpose.create({
                data: {
                    label: args.label
                }
            })
        },

        updateDocumentPurpose: async (_: unknown, args: DocumentPurpose) => {
            return await dataClient.documentPurpose.update({
                where: {
                    id: args.id
                },
                data: {
                    label: args.label
                }
            })
        },

        deleteDocumentPurpose: async (_: unknown, args: DocumentPurpose) => {
            const purposes = await dataClient.documents.aggregate({
                where: {
                    purposeId: args.id
                },
                _count: true
            });

            if (purposes._count > 0) throw new GraphQLError('There are active documents under this purpose.', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
            });

            return await dataClient.documentPurpose.delete({
                where: {
                    id: args.id
                }
            })
        },

        // ============================== DOCUMENT STATUS ===================================

        createDocumentStatus: async (_: unknown, args: DocumentStatus) => {
            return await dataClient.documentStatus.create({
                data: {
                    label: args.label,
                    category: args.category
                }
            })
        },

        updateDocumentStatus: async (_: unknown, args: DocumentStatus) => {
            return await dataClient.documentStatus.update({
                where: {
                    id: args.id
                },
                data: {
                    label: args.label,
                    category: args.category
                }
            })
        },

        deleteDocumentStatus: async (_: unknown, args: DocumentStatus) => {
            const status = await dataClient.referrals.aggregate({
                where: {
                    statusId: args.id
                },
                _count: true
            });

            if (status._count > 0) throw new GraphQLError('There are active documents under this status.', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
            });

            return await dataClient.documentStatus.delete({
                where: {
                    id: args.id
                }
            })
        },

        // ============================== DOCUMENTS ===================================

        createDocument: async (_: unknown, args: DocumentInput) => {
            const { subject, description, receivedFrom, typeId, purposeId, signatureId, tag, dateDue, referredTo } = args;

            // get current count
            const today = new Date();
            const document = await dataClient.documents.findFirst({
                where: {
                    dateCreated: {
                        gt: new Date(today.getFullYear(), today.getMonth(), 0)
                    }
                },
                orderBy: {
                    referenceNum: 'desc'
                },
                select: {
                    referenceNum: true
                }
            });

            // generate reference number
            let serial: string = document ? document.referenceNum.split('-')[3] : "00000";
            const referenceNum = `RR6-${today.getFullYear()}-${today.getMonth() + 1}-${String((parseInt(serial) + 1)).padStart(5, '0')}`;

            // trigger created document event
            pubsub.publish("OFFICE_ADMIN", {
                officeEvents: {
                    eventName: `CREATED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            });

            // trigger assigned document event
            referredTo.forEach(ref => pubsub.publish(`OFFICE_${ref.officeId.toString()}`, {
                officeEvents: {
                    eventName: `ASSIGNED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            }));

            // send notification
            referredTo.forEach(ref => sendNotification(ref.officeId, `Assigned Document ${referenceNum}`, subject));

            // create new document
            return await dataClient.documents.create({
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
                            data: referredTo
                        }
                    }
                }
            });
        },

        updateDocument: async (_: unknown, args: DocumentInput) => {
            const { referenceNum, subject, description, receivedFrom, typeId, purposeId, signatureId, tag, dateDue, referredTo } = args;

            // remove former referrals 
            await dataClient.referrals.deleteMany({
                where: {
                    documentId: referenceNum
                }
            });

            // trigger updated document event
            pubsub.publish(`DOCUMENT_${referenceNum}`, {
                documentEvents : {
                    eventName: `UPDATED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            });

            // trigger updated document event
            pubsub.publish("OFFICE_ADMIN", {
                officeEvents: {
                    eventName: `UPDATED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            });

            // trigger reassigned document event
            referredTo.forEach(ref => pubsub.publish(`OFFICE_${ref.officeId.toString()}`, {
                officeEvents: {
                    eventName: `UPDATED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            }));
        
            return await dataClient.documents.update({
                where: {
                    referenceNum: referenceNum
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
                    referrals: {
                        createMany: {
                            data: referredTo
                        }
                    }
                }
            });
        },

        documentUpdateStatus: async (_: unknown, args: { referenceNum: string, officeId: number, statusId: number }) => {
            const updated = await dataClient.referrals.update({
                where: {
                    documentId_officeId: {
                        documentId: args.referenceNum,
                        officeId: args.officeId
                    }
                },
                data: {
                    statusId: args.statusId
                },
                select: {
                    status: true
                }
            });

            // trigger updated document event
            pubsub.publish(`DOCUMENT_${args.referenceNum}`, {
                documentEvents: {
                    eventName: `UPDATED_DOCUMENT_${args.referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            });

            // trigger updated document event
            pubsub.publish("OFFICE_ADMIN", {
                officeEvents: {
                    eventName: `UPDATED_DOCUMENT_${args.referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            });

            // trigger updated document event
            pubsub.publish(`OFFICE_${args.officeId.toString()}`, {
                officeEvents: {
                    eventName: `UPDATED_DOCUMENT_${args.referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            })

            return updated.status
        },

        deleteDocument: async (_: unknown, args: DocumentInput) => {
            const { referenceNum } = args;

            const deleted = await dataClient.documents.delete({
                where: {
                    referenceNum: referenceNum
                },
                include: {
                    referrals: {
                        select: {
                            officeId: true
                        }
                    }
                }
            });

            // trigger created document event
            pubsub.publish("OFFICE_ADMIN", {
                officeEvents: {
                    eventName: `DELETED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            });

            // trigger assigned document event
            deleted.referrals.forEach(office => pubsub.publish(`OFFICE_${office.officeId.toString()}`, {
                officeEvents: {
                    eventName: `DELETED_DOCUMENT_${referenceNum}`,
                    eventDate: new Date().toISOString()
                }
            }));

            return deleted;
        },

        createComment: async (_: unknown, args: CommentInput) => {
            const { senderId, documentId, message, files, level } = args;

            // trigger updated document event
            pubsub.publish(`DOCUMENT_${documentId}`, {
                documentEvents : {
                    eventName: `ADDED_COMMENT_${documentId}`,
                    eventDate: new Date().toISOString()
                }
            });

            return await dataClient.comments.create({
                data: {
                    documentId: documentId,
                    senderId: senderId,
                    message: message,
                    level: level,
                    files: files.join(';')
                }
            });
        }
    },

    Subscription: {
        officeEvents: {
            subscribe: (officeId: number | null) => {
                if (!officeId) return pubsub.asyncIterator(["OFFICE_ADMIN"]);
                return pubsub.asyncIterator([`OFFICE_${officeId.toString()}`]);
            },
        },

        documentEvents: {
            subscribe: (referenceNum: string) => {
                return pubsub.asyncIterator([`DOCUMENT_${referenceNum}`]);
            },
        }
    }
}

export default resolvers;