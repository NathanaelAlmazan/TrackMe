(self.webpackChunkclient=self.webpackChunkclient||[]).push([[64],{8064:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>L});var r=t(9060),c=t(2656),s=t(4488),i=t(5448),o=t(8960),a=t(7256),l=t(6880),d=t(5548),u=t(9e3),h=t(7824),x=t(3288),m=t(2044),p=t(3692),v=t(4436),j=t(5364),f=t(7960),g=t(4194),b=t(2496);function y(e){const n=e.split("_");return n[n.length-1]}function w(e){let{senderId:n,message:t,senderName:r,files:c}=e;const{uuid:s}=(0,g.Cq)((e=>e.auth));return(0,b.jsx)(a.c,{sx:s===n?{pl:"5%"}:{pr:"5%"},children:(0,b.jsxs)(p.c,{children:[(0,b.jsx)(v.c,{children:(0,b.jsxs)(o.c,{direction:{xs:"column",sm:"row"},spacing:2,children:[(0,b.jsx)(f.c,{src:"/assets/images/avatars/avatar_13.jpg",alt:"Nathanael Almazan",sx:{width:50,height:50,border:e=>"solid 2px ".concat(e.palette.background.default)}}),(0,b.jsxs)(a.c,{children:[(0,b.jsx)(l.c,{variant:"subtitle1",children:r}),(0,b.jsx)(l.c,{variant:"body1",children:t})]})]})}),c&&c.length>0&&(0,b.jsx)(j.c,{sx:{display:"flex",justifyContent:"flex-end"},children:(0,b.jsx)(a.c,{sx:{maxWidth:"100%",overflow:"auto",display:"flex",flexDirection:"row"},children:c.map((e=>(0,b.jsx)(l.c,{component:"a",variant:"body2",href:e.trim(),target:"_blank",sx:{mx:"5px"},children:y(e)},e)))})})]})})}var D=t(8320),I=t(3358),C=t(9572),N=t(7532),k=t(8372),S=t(3540),B=t(5436);function F(e){let{referenceNum:n,onComment:t}=e;const c=(0,x.c)(),{uuid:s}=(0,g.Cq)((e=>e.auth)),[i,l]=(0,r.useState)(""),[u,h]=(0,r.useState)([]),[p,v]=(0,r.useState)(),[j,{error:f}]=(0,S.c)(B.ef);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(a.c,{component:"form",onSubmit:async e=>{if(e.preventDefault(),!s)return void v("Not logged in.");let r=[];if(u.length>0)try{const e=new FormData;u.forEach((n=>{e.append("files",n)}));r=(await k.c.post("https://rr6manila.com/api/upload",e)).data.files}catch(c){return void v("Failed to upload files.")}await j({variables:{documentId:n,senderId:s,message:i,files:r.map((e=>e.fileUrl))}}),t(),l(""),h([])},sx:{position:"absolute",backgroundColor:c.palette.background.paper,bottom:0,left:0,right:0,px:3,pt:1},children:(0,b.jsxs)(o.c,{spacing:2,children:[(0,b.jsx)(a.c,{sx:{maxWidth:"100%",overflow:"auto",display:"flex",flexDirection:"row"},children:u.map((e=>(0,b.jsx)(N.c,{label:e.name,variant:"outlined",onDelete:()=>{return n=e.name,void h((e=>e.filter((e=>e.name!==n))));var n},sx:{mx:"5px"}},e.name)))}),(0,b.jsx)(D.c,{variant:"outlined",placeholder:"Comment...",value:i,onChange:e=>l(e.target.value),required:!0,fullWidth:!0,InputProps:{endAdornment:(0,b.jsx)(C.c,{position:"end",children:(0,b.jsxs)(o.c,{direction:"row",children:[(0,b.jsx)(I.c,{title:"Insert File",children:(0,b.jsxs)(d.c,{component:"label",children:[(0,b.jsx)(m.ov,{icon:"material-symbols:attach-file-add-rounded"}),(0,b.jsx)("input",{type:"file",multiple:!0,hidden:!0,style:{display:"none"},onChange:e=>{const n=e.target.files;n&&h((e=>e.concat(function(e){const n=[];for(let t=0;t<e.length;t++){const r=e.item(t);r&&n.push(r)}return n}(n))))}})]})}),(0,b.jsx)(I.c,{title:"Send",children:(0,b.jsx)(d.c,{type:"submit",children:(0,b.jsx)(m.ov,{icon:"ic:baseline-send"})})})]})})}})]})}),(0,b.jsx)(m.wR,{severity:"error",message:(null===f||void 0===f?void 0:f.message)||p})]})}var W=t(1096),P=t(3856),_=t(9504),R=t(700),E=t(9904),T=t(7454),z=t(2560);function M(e){let{receivedFrom:n,dateCreated:t,dateDue:r,refferedTo:c,type:s,purpose:i,tag:o}=e;return(0,b.jsxs)(p.c,{variant:"outlined",children:[(0,b.jsx)(W.c,{title:"Details"}),(0,b.jsx)(a.c,{sx:{maxHeight:{sm:"100%",md:"80vh"},overflowY:{sm:"inherit",md:"auto"}},children:(0,b.jsx)(E.c,{children:(0,b.jsx)(P.c,{size:"small","aria-label":"dense table",children:(0,b.jsxs)(_.c,{children:[(0,b.jsxs)(T.c,{children:[(0,b.jsx)(R.c,{component:"th",scope:"row",children:(0,b.jsx)(l.c,{variant:"subtitle2",noWrap:!0,children:"Received From"})}),(0,b.jsx)(R.c,{children:(0,b.jsx)(l.c,{variant:"body2",children:n})})]}),(0,b.jsxs)(T.c,{children:[(0,b.jsx)(R.c,{component:"th",scope:"row",children:(0,b.jsx)(l.c,{variant:"subtitle2",noWrap:!0,children:"Referred To"})}),(0,b.jsx)(R.c,{children:(0,b.jsx)(l.c,{variant:"body2",children:c})})]}),(0,b.jsxs)(T.c,{children:[(0,b.jsx)(R.c,{component:"th",scope:"row",children:(0,b.jsx)(l.c,{variant:"subtitle2",noWrap:!0,children:"Date Received"})}),(0,b.jsx)(R.c,{children:(0,b.jsx)(l.c,{variant:"body2",children:t&&new Date(t).toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric",weekday:"short"})})})]}),(0,b.jsxs)(T.c,{children:[(0,b.jsx)(R.c,{component:"th",scope:"row",children:(0,b.jsx)(l.c,{variant:"subtitle2",noWrap:!0,children:"Date Due"})}),(0,b.jsx)(R.c,{children:(0,b.jsx)(l.c,{variant:"body2",children:r&&new Date(r).toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric",weekday:"short"})})})]}),(0,b.jsxs)(T.c,{children:[(0,b.jsx)(R.c,{component:"th",scope:"row",children:(0,b.jsx)(l.c,{variant:"subtitle2",noWrap:!0,children:"Document Type"})}),(0,b.jsx)(R.c,{children:(0,b.jsx)(l.c,{variant:"body2",children:s})})]}),(0,b.jsxs)(T.c,{children:[(0,b.jsx)(R.c,{component:"th",scope:"row",children:(0,b.jsx)(l.c,{variant:"subtitle2",noWrap:!0,children:"Purpose"})}),(0,b.jsx)(R.c,{children:(0,b.jsx)(l.c,{variant:"body2",children:i})})]}),(0,b.jsxs)(T.c,{children:[(0,b.jsx)(R.c,{component:"th",scope:"row",children:(0,b.jsx)(l.c,{variant:"subtitle2",noWrap:!0,children:"Tag"})}),(0,b.jsx)(R.c,{children:(0,b.jsx)(l.c,{variant:"body2",children:o?(0,z.SI)(o):"None"})})]})]})})})})]})}var O=t(6931),q=t(9344),U=t(4480),Y=t(4296);function A(e){let{officeId:n,status:t,referenceNum:c}=e;const{data:s,error:i}=(0,U.U)(B.SY,{fetchPolicy:"no-cache"}),[o,{error:a}]=(0,S.c)(B.wb),[l,d]=(0,r.useState)(null),[h,x]=(0,r.useState)(t||"");return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(u.c,{variant:"contained",onClick:e=>{d(e.currentTarget)},endIcon:(0,b.jsx)(m.ov,{icon:"solar:alt-arrow-down-line-duotone"}),children:h}),(0,b.jsx)(O.cp,{open:!!l,anchorEl:l,onClose:()=>{d(null)},anchorOrigin:{vertical:"bottom",horizontal:"right"},transformOrigin:{vertical:"top",horizontal:"right"},PaperProps:{sx:{p:0,mt:1,ml:.75,width:200}},children:s&&s.getDocumentStatus.filter((e=>e.category===Y.sD.Ongoing||void 0===n)).map((e=>(0,b.jsx)(q.c,{onClick:n=>(async(e,n)=>{d(null);const t=await o({variables:{referenceNum:c,statusId:n}});t.data&&x(t.data.documentUpdateStatus.label)})(0,parseInt(e.id)),children:e.label},e.label)))}),(0,b.jsx)(m.wR,{severity:"error",message:(null===i||void 0===i?void 0:i.message)||(null===a||void 0===a?void 0:a.message)})]})}var H=t(8504);function L(e){var n,t,p;let{officeId:v,referenceNum:j,open:f,onClose:g}=e;const y=(0,x.c)(),{data:D,error:I,refetch:C}=(0,U.U)(B.WK,{fetchPolicy:"no-cache",variables:{referenceNum:j}}),{data:N,error:k}=(0,H.Q)(B.Cy,{fetchPolicy:"no-cache",variables:{referenceNum:j}});return(0,r.useEffect)((()=>{N&&C()}),[N,C]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c.c,{open:f,onClose:g,maxWidth:"lg",fullWidth:!0,children:(0,b.jsx)(s.c,{children:(0,b.jsxs)(i.cp,{container:!0,spacing:3,children:[(0,b.jsxs)(i.cp,{item:!0,xs:12,sm:12,md:8,sx:{position:"relative"},children:[(0,b.jsxs)(o.c,{spacing:3,sx:{maxHeight:{sm:"100%",md:"80vh"},overflow:{sm:"inherit",md:"auto"},p:2,pb:10},children:[(0,b.jsxs)(a.c,{children:[(0,b.jsx)(l.c,{variant:"h6",children:"#".concat(null===D||void 0===D?void 0:D.getDocumentById.referenceNum)}),(0,b.jsx)(l.c,{variant:"h3",children:null===D||void 0===D?void 0:D.getDocumentById.subject})]}),(0,b.jsx)(a.c,{children:(0,b.jsx)(l.c,{variant:"body1",children:null===D||void 0===D?void 0:D.getDocumentById.description})}),(0,b.jsxs)(o.c,{spacing:2,sx:{backgroundColor:y.palette.grey[200],p:2,borderRadius:3},children:[D&&D.getDocumentById.comments.map((e=>(0,b.jsx)(w,{senderName:[e.sender.firstName,e.sender.lastName].join(" "),senderId:e.sender.uuid,message:e.message,files:e.files},e.id))),D&&0===D.getDocumentById.comments.length&&(0,b.jsx)(l.c,{variant:"subtitle1",children:"No Comment Yet."})]})]}),(0,b.jsx)(F,{referenceNum:j,onComment:()=>C()})]}),(0,b.jsx)(i.cp,{item:!0,xs:12,sm:12,md:4,sx:{position:"relative"},children:(0,b.jsxs)(o.c,{spacing:3,children:[(0,b.jsxs)(o.c,{direction:"row",alignItems:"center",justifyContent:"space-between",children:[(0,b.jsxs)(o.c,{direction:"row",alignItems:"center",spacing:2,children:[D&&(0,b.jsx)(A,{officeId:v,status:null===(n=D.getDocumentById.status)||void 0===n?void 0:n.label,referenceNum:D.getDocumentById.referenceNum}),(0,b.jsx)(u.c,{variant:"contained",endIcon:(0,b.jsx)(m.ov,{icon:"ant-design:export-outlined"}),children:"Export"})]}),(0,b.jsx)(d.c,{onClick:g,sx:{width:50,height:50},children:(0,b.jsx)(h.c,{})})]}),(0,b.jsx)(M,{receivedFrom:null===D||void 0===D?void 0:D.getDocumentById.receivedFrom,refferedTo:null===D||void 0===D?void 0:D.getDocumentById.refferedTo.map((e=>e.name)).join(", "),type:null===D||void 0===D||null===(t=D.getDocumentById.type)||void 0===t?void 0:t.label,purpose:null===D||void 0===D||null===(p=D.getDocumentById.purpose)||void 0===p?void 0:p.label,dateCreated:null===D||void 0===D?void 0:D.getDocumentById.dateCreated,dateDue:null===D||void 0===D?void 0:D.getDocumentById.dateDue,tag:null===D||void 0===D?void 0:D.getDocumentById.tag})]})})]})})}),(0,b.jsx)(m.wR,{severity:"error",message:(null===I||void 0===I?void 0:I.message)||(null===k||void 0===k?void 0:k.message)})]})}},7824:(e,n,t)=>{"use strict";var r=t(2411);n.c=void 0;var c=r(t(864)),s=t(2496);n.c=(0,c.default)((0,s.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close")},864:(e,n,t)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"default",{enumerable:!0,get:function(){return r.createSvgIcon}});var r=t(8912)},8912:(e,n,t)=>{"use strict";t.r(n),t.d(n,{capitalize:()=>c.c,createChainedFunction:()=>s,createSvgIcon:()=>i.c,debounce:()=>o.c,deprecatedPropType:()=>a,isMuiElement:()=>l.c,ownerDocument:()=>d.c,ownerWindow:()=>u.c,requirePropFactory:()=>h,setRef:()=>x,unstable_ClassNameGenerator:()=>y,unstable_useEnhancedEffect:()=>m.c,unstable_useId:()=>p.c,unsupportedProp:()=>v,useControlled:()=>j.c,useEventCallback:()=>f.c,useForkRef:()=>g.c,useIsFocusVisible:()=>b.c});var r=t(1152),c=t(5832);const s=t(1200).c;var i=t(48),o=t(2144);const a=function(e,n){return()=>null};var l=t(8276),d=t(3976),u=t(1328);t(5072);const h=function(e,n){return()=>null};const x=t(472).c;var m=t(7188),p=t(8144);const v=function(e,n,t,r,c){return null};var j=t(1124),f=t(7908),g=t(6268),b=t(2864);const y={configure:e=>{r.c.configure(e)}}},2411:e=>{e.exports=function(e){return e&&e.__esModule?e:{default:e}},e.exports.__esModule=!0,e.exports.default=e.exports}}]);
//# sourceMappingURL=64.a92d0b50.chunk.js.map