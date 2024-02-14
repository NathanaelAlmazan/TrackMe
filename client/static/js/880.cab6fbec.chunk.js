"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[880],{5436:(e,n,t)=>{t.d(n,{An:()=>f,CI:()=>g,Cy:()=>j,ED:()=>s,SM:()=>u,SY:()=>m,W6:()=>c,WK:()=>$,Yx:()=>y,aK:()=>b,c3:()=>D,ef:()=>h,f_:()=>i,gp:()=>I,gz:()=>o,kl:()=>p,oV:()=>a,oz:()=>d,sT:()=>S,wb:()=>w,wt:()=>x,yA:()=>v,yu:()=>l});var r=t(4768);const a=(0,r.I)("\n    query GetDocumentTypes {\n        getDocumentTypes {\n            id\n            label\n        }\n    }\n"),i=(0,r.I)("\n    mutation CreateDocumentType($label: String!) {\n        createDocumentType(label: $label) {\n            id\n            label\n        }\n    }\n"),o=(0,r.I)("\n    mutation UpdateDocumentType($id: Int!, $label: String!) {\n        updateDocumentType(id: $id, label: $label) {\n            id\n            label\n        }\n    }\n"),s=(0,r.I)("\n    mutation DeleteDocumentType($id: Int!) {\n        deleteDocumentType(id: $id) {\n            id  \n            label\n        }\n    }\n"),l=(0,r.I)("\n    query GetDocumentPurposes {\n        getDocumentPurposes {\n            id\n            label\n        }\n    }\n"),c=(0,r.I)("\n    mutation CreateDocumentPurpose($label: String!) {\n        createDocumentPurpose(label: $label) {\n            id\n            label\n        }\n    }\n"),d=(0,r.I)("\n    mutation UpdateDocumentPurpose($id: Int!, $label: String!) {\n        updateDocumentPurpose(id: $id, label: $label) {\n            id\n            label\n        }\n    }\n"),u=(0,r.I)("\n    mutation DeleteDocumentPurpose($id: Int!) {\n        deleteDocumentPurpose(id: $id) {\n            id\n            label\n        }\n    }\n"),m=(0,r.I)("\n    query GetDocumentStatus {\n        getDocumentStatus {\n            id\n            label\n            category\n        }\n    }\n"),g=(0,r.I)("\n    mutation CreateDocumentStatus($label: String!, $category: Status!) {\n        createDocumentStatus(label: $label, category: $category) {\n            id\n            label\n            category\n        }\n    }\n"),v=(0,r.I)("\n    mutation UpdateDocumentStatus($id: Int!, $label: String!, $category: Status!) {\n        updateDocumentStatus(id: $id, label: $label, category: $category) {\n            id\n            label\n            category\n        }\n    }\n"),f=(0,r.I)("\n    mutation DeleteDocumentStatus($id: Int!) {\n        deleteDocumentStatus(id: $id) {\n            id\n            label\n            category\n        }\n    }\n"),p=(0,r.I)("\n    query TempReferenceNum {\n        getTempReferenceNum\n    }\n"),I=(0,r.I)("\n    query GetDocumentSummary {\n        getDocumentSummary {\n            closed\n            noaction\n            office\n            ongoing\n            referred\n        }\n    }\n"),b=(0,r.I)("\n    query GetDocuments($officeId: Int) {\n        getDocuments(officeId: $officeId) {\n            referenceNum\n            subject\n            receivedFrom\n            refferedTo {\n                name\n            }\n            tag\n            status {\n                label\n                category\n            }\n            dateCreated\n        }\n    }\n"),$=(0,r.I)("\n    query GetDocumentById($referenceNum: String!) {\n        getDocumentById(referenceNum: $referenceNum) {\n            referenceNum\n            subject\n            description\n            receivedFrom\n            refferedTo {\n                id\n                name\n            }\n            type {\n                id\n                label\n            }\n            purpose {\n                id\n                label\n            }\n            tag\n            status {\n                id\n                label\n                category\n            }\n            dateCreated\n            dateDue\n            comments {\n                id\n                sender {\n                    uuid\n                    firstName\n                    lastName\n                    position {\n                        label\n                    }\n                }   \n                files\n                message\n                dateCreated\n            }\n        }\n    }\n"),y=(0,r.I)("\n    mutation CreateDocument($subject: String!, $description: String!, $receivedFrom: String!, $typeId: Int!, $purposeId: Int!, $statusId: Int!, $dateDue: String!, $refferedTo: [Int!]!, $tag: Tags) {\n        createDocument(subject: $subject, description: $description, receivedFrom: $receivedFrom, typeId: $typeId, purposeId: $purposeId, statusId: $statusId, dateDue: $dateDue, refferedTo: $refferedTo, tag: $tag) {\n            referenceNum\n        }\n    }\n"),D=(0,r.I)("\n    mutation UpdateDocument($referenceNum: String!, $subject: String, $description: String, $receivedFrom: String, $typeId: Int, $purposeId: Int, $statusId: Int, $tag: Tags, $dateDue: String, $refferedTo: [Int]) {\n        updateDocument(referenceNum: $referenceNum, subject: $subject, description: $description, receivedFrom: $receivedFrom, typeId: $typeId, purposeId: $purposeId, statusId: $statusId, tag: $tag, dateDue: $dateDue, refferedTo: $refferedTo) {\n            referenceNum\n        }\n    }\n"),S=(0,r.I)("\n    mutation DeleteDocument($referenceNum: String!) {\n        deleteDocument(referenceNum: $referenceNum) {\n            subject\n        }\n    }\n"),w=(0,r.I)("\n    mutation DocumentUpdateStatus($referenceNum: String!, $statusId: Int!) {\n        documentUpdateStatus(referenceNum: $referenceNum, statusId: $statusId) {\n            id\n            label\n        }\n    }\n"),h=(0,r.I)("\n    mutation CreateComment($documentId: String!, $senderId: String!, $message: String!, $files: [String!]) {\n        createComment(documentId: $documentId, senderId: $senderId, message: $message, files: $files) {\n            id\n        }\n    }\n"),j=(0,r.I)("\n    subscription DocumentEvents($referenceNum: String!) {\n        documentEvents(referenceNum: $referenceNum) {\n            eventDate\n            eventName\n        }\n    }\n"),x=(0,r.I)("\n    query GetDocumentStatistics($officeId: Int) {\n        getDocumentStatistics(officeId: $officeId) {\n            closed\n            noaction\n            ongoing\n            referred\n        }\n    }\n")},7880:(e,n,t)=>{t.r(n),t.d(n,{default:()=>I});var r=t(1712),a=t(5448),i=t(6880),o=t(4480),s=t(3540),l=t(2044),c=t(8964),d=t(2496);function u(){const{data:e,error:n,loading:t,refetch:r}=(0,o.U)(c.It,{fetchPolicy:"no-cache"}),[a,{error:i}]=(0,s.c)(c.aK),[u,{error:m}]=(0,s.c)(c.sz),[g,{error:v}]=(0,s.c)(c.i_);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Offices",items:e.getOffices.map((e=>({id:parseInt(e.id),label:e.name}))),onCreate:async(e,n)=>{await a({variables:{name:e}}),await r()},onUpdate:async(e,n,t)=>{await u({variables:{id:e,name:n}}),await r()},onDelete:async e=>{await g({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===n||void 0===n?void 0:n.message)||(null===i||void 0===i?void 0:i.message)||(null===m||void 0===m?void 0:m.message)||(null===v||void 0===v?void 0:v.message)})]})}var m=t(5436);function g(){const{data:e,error:n,loading:t,refetch:r}=(0,o.U)(m.yu,{fetchPolicy:"no-cache"}),[a,{error:i}]=(0,s.c)(m.W6),[c,{error:u}]=(0,s.c)(m.oz),[g,{error:v}]=(0,s.c)(m.SM);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Document Purpose",items:e.getDocumentPurposes.map((e=>({id:parseInt(e.id),label:e.label}))),onCreate:async(e,n)=>{await a({variables:{label:e}}),await r()},onUpdate:async(e,n,t)=>{await c({variables:{id:e,label:n}}),await r()},onDelete:async e=>{await g({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===n||void 0===n?void 0:n.message)||(null===i||void 0===i?void 0:i.message)||(null===u||void 0===u?void 0:u.message)||(null===v||void 0===v?void 0:v.message)})]})}function v(){const{data:e,error:n,loading:t,refetch:r}=(0,o.U)(m.SY,{fetchPolicy:"no-cache"}),[a,{error:i}]=(0,s.c)(m.CI),[c,{error:u}]=(0,s.c)(m.yA),[g,{error:v}]=(0,s.c)(m.An);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Document Status",items:e.getDocumentStatus.map((e=>({id:parseInt(e.id),label:e.label,category:e.category}))),categories:[{label:"Finished",value:"FINISHED"},{label:"Not Actionable",value:"NOT_ACTIONABLE"},{label:"Not Started",value:"NOT_STARTED"},{label:"On Going",value:"ONGOING"}],onCreate:async(e,n)=>{n&&(await a({variables:{label:e,category:n}}),await r())},onUpdate:async(e,n,t)=>{t&&(await c({variables:{id:e,label:n,category:t}}),await r())},onDelete:async e=>{await g({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===n||void 0===n?void 0:n.message)||(null===i||void 0===i?void 0:i.message)||(null===u||void 0===u?void 0:u.message)||(null===v||void 0===v?void 0:v.message)})]})}function f(){const{data:e,error:n,loading:t,refetch:r}=(0,o.U)(m.oV,{fetchPolicy:"no-cache"}),[a,{error:i}]=(0,s.c)(m.f_),[c,{error:u}]=(0,s.c)(m.gz),[g,{error:v}]=(0,s.c)(m.ED);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Document Types",items:e.getDocumentTypes.map((e=>({id:parseInt(e.id),label:e.label}))),onCreate:async(e,n)=>{await a({variables:{label:e}}),await r()},onUpdate:async(e,n,t)=>{await c({variables:{id:e,label:n}}),await r()},onDelete:async e=>{await g({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===n||void 0===n?void 0:n.message)||(null===i||void 0===i?void 0:i.message)||(null===u||void 0===u?void 0:u.message)||(null===v||void 0===v?void 0:v.message)})]})}function p(){const{data:e,error:n,loading:t,refetch:r}=(0,o.U)(c.mq,{fetchPolicy:"no-cache"}),[a,{error:i}]=(0,s.c)(c.Iz),[u,{error:m}]=(0,s.c)(c.aG),[g,{error:v}]=(0,s.c)(c.ew);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Positions",items:e.getPositions.map((e=>({id:parseInt(e.id),label:e.label,category:e.role}))),categories:[{label:"Officer",value:"OFFICER"},{label:"Chief",value:"CHIEF"},{label:"Director",value:"DIRECTOR"},{label:"Superuser",value:"SUPERUSER"},{label:"HR Admin",value:"HR_ADMIN"}],onCreate:async(e,n)=>{n&&(await a({variables:{label:e,role:n}}),await r())},onUpdate:async(e,n,t)=>{t&&(await u({variables:{id:e,label:n,role:t}}),await r())},onDelete:async e=>{await g({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===n||void 0===n?void 0:n.message)||(null===i||void 0===i?void 0:i.message)||(null===m||void 0===m?void 0:m.message)||(null===v||void 0===v?void 0:v.message)})]})}function I(){return(0,d.jsx)(r.c,{children:(0,d.jsxs)(a.cp,{container:!0,spacing:3,children:[(0,d.jsx)(a.cp,{item:!0,xs:12,children:(0,d.jsx)(i.c,{variant:"h4",children:"Settings"})}),(0,d.jsx)(a.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(u,{})}),(0,d.jsx)(a.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(g,{})}),(0,d.jsx)(a.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(f,{})}),(0,d.jsx)(a.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(v,{})}),(0,d.jsx)(a.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(p,{})})]})})}},3540:(e,n,t)=>{t.d(n,{c:()=>d});var r=t(7328),a=t(9528),i=t(2200),o=t(3520),s=t(9179),l=t(4056),c=t(3960);function d(e,n){var t=(0,c.y)(null===n||void 0===n?void 0:n.client);(0,s.Y5)(e,s.UT.Mutation);var d=a.useState({called:!1,loading:!1,client:t}),u=d[0],m=d[1],g=a.useRef({result:u,mutationId:0,isMounted:!0,client:t,mutation:e,options:n});Object.assign(g.current,{client:t,options:n,mutation:e});var v=a.useCallback((function(e){void 0===e&&(e={});var n=g.current,t=n.options,a=n.mutation,s=(0,r.C3)((0,r.C3)({},t),{mutation:a}),c=e.client||g.current.client;g.current.result.loading||s.ignoreResults||!g.current.isMounted||m(g.current.result={loading:!0,error:void 0,data:void 0,called:!0,client:c});var d=++g.current.mutationId,u=(0,i.I)(s,e);return c.mutate(u).then((function(n){var t,r,a=n.data,i=n.errors,s=i&&i.length>0?new l._M({graphQLErrors:i}):void 0,v=e.onError||(null===(t=g.current.options)||void 0===t?void 0:t.onError);if(s&&v&&v(s,u),d===g.current.mutationId&&!u.ignoreResults){var f={called:!0,loading:!1,data:a,error:s,client:c};g.current.isMounted&&!(0,o.y)(g.current.result,f)&&m(g.current.result=f)}var p=e.onCompleted||(null===(r=g.current.options)||void 0===r?void 0:r.onCompleted);return s||null===p||void 0===p||p(n.data,u),n})).catch((function(n){var t;if(d===g.current.mutationId&&g.current.isMounted){var r={loading:!1,error:n,data:void 0,called:!0,client:c};(0,o.y)(g.current.result,r)||m(g.current.result=r)}var a=e.onError||(null===(t=g.current.options)||void 0===t?void 0:t.onError);if(a)return a(n,u),{data:void 0,errors:n};throw n}))}),[]),f=a.useCallback((function(){if(g.current.isMounted){var e={called:!1,loading:!1,client:t};Object.assign(g.current,{mutationId:0,result:e}),m(e)}}),[]);return a.useEffect((function(){return g.current.isMounted=!0,function(){g.current.isMounted=!1}}),[]),[v,(0,r.C3)({reset:f},u)]}}}]);
//# sourceMappingURL=880.cab6fbec.chunk.js.map