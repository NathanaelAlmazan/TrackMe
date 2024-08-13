"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[296],{3884:(e,r,t)=>{t.d(r,{c:()=>x});var i=t(9060),n=t(4380),s=t(3996),l=t(2892),a=t(9720),c=t(3540),o=t(3055),d=t(4296),u=t(2496);const h=[{value:d.sD.Referred,label:"Referred"},{value:d.sD.ForReview,label:"For Review"},{value:d.sD.ForRevision,label:"For Revision"},{value:d.sD.ForCorrection,label:"For Correction"},{value:d.sD.ForApproval,label:"For Approval"},{value:d.sD.UpdateReport,label:"Update Report"},{value:d.sD.Finished,label:"Closed"}],f=[{value:d.sD.Submitted,label:"Submitted"},{value:d.sD.ForApproval,label:"For Approval"},{value:d.sD.ForReview,label:"For Review"},{value:d.sD.ForCorrection,label:"For Correction"}];function x(e){let{officeId:r,status:t,referenceNum:x,role:v,onUpdate:m,width:g=150,showLabel:j=!0}=e;const{data:p,error:b}=(0,a.UL)(o.SY,{fetchPolicy:"no-cache"}),[w,{error:S}]=(0,c.c)(o.wb),[C,F]=(0,i.useState)(null),[D,N]=(0,i.useState)(d.sD.Referred);(0,i.useEffect)((()=>{t&&N(t)}),[t]);const R=async e=>{var t;if(!r)return;const i=null===p||void 0===p||null===(t=p.getDocumentStatus.find((r=>r.category===e)))||void 0===t?void 0:t.id;if(!i)return void F("Status not found");(await w({variables:{officeId:r,referenceNum:x,statusId:parseInt(i)}})).data&&N(e),m&&m()};return(0,u.jsxs)(u.Fragment,{children:[v===d.QJ.Director&&D!==d.sD.NotActionable&&(0,u.jsx)(n.c,{name:"status",select:!0,label:j?"Status":void 0,variant:"outlined",value:D,onChange:e=>R(e.target.value),required:!0,fullWidth:!0,sx:{width:g},children:h.map((e=>(0,u.jsx)(s.c,{value:e.value,children:e.label},e.value)))}),v===d.QJ.Chief&&D!==d.sD.NotActionable&&D!==d.sD.Finished&&(0,u.jsx)(n.c,{name:"status",select:!0,label:"Status",variant:"outlined",value:D,onChange:e=>R(e.target.value),required:!0,fullWidth:!0,children:f.map((e=>(0,u.jsx)(s.c,{value:e.value,children:e.label},e.value)))}),(0,u.jsx)(l.wR,{severity:"error",message:C||(null===b||void 0===b?void 0:b.message)||(null===S||void 0===S?void 0:S.message)})]})}},6915:(e,r,t)=>{t.r(r),t.d(r,{default:()=>V,formatReferrals:()=>B});var i=t(9060),n=t(3692),s=t(7256),l=t(3856),a=t(9504),c=t(700),o=t(7454),d=t(9904),u=t(9592),h=t(3358),f=t(6768),x=t(5548),v=t(5594),m=t(9572),g=t(8960),j=t(2892),p=t(2496);function b(e){let{filterName:r,onRefresh:t,onFilter:i,onFilterName:n}=e;return(0,p.jsxs)(f.c,{sx:{height:96,display:"flex",justifyContent:"space-between",p:e=>e.spacing(0,1,0,3)},children:[(0,p.jsx)(v.c,{value:r,onChange:n,placeholder:"Search...",startAdornment:(0,p.jsx)(m.c,{position:"start",children:(0,p.jsx)(j.ov,{icon:"eva:search-fill",sx:{color:"text.disabled",width:20,height:20}})})}),(0,p.jsxs)(g.c,{direction:"row",children:[(0,p.jsx)(h.c,{title:"Filter",children:(0,p.jsx)(x.c,{onClick:i,children:(0,p.jsx)(j.ov,{icon:"fluent:filter-20-filled"})})}),(0,p.jsx)(h.c,{title:"Refresh",children:(0,p.jsx)(x.c,{onClick:t,children:(0,p.jsx)(j.ov,{icon:"mdi:refresh"})})})]})]})}var w=t(8612),S=t(3248);function C(e){let{order:r,orderBy:t,officeId:i,headLabel:n,onRequestSort:l}=e;return(0,p.jsx)(w.c,{children:(0,p.jsxs)(o.c,{children:[void 0===i&&(0,p.jsx)(c.c,{}),n.map((e=>{return(0,p.jsx)(c.c,{align:e.align||"left",sortDirection:t===e.id&&r,sx:{width:e.width,minWidth:e.minWidth},children:(0,p.jsxs)(S.c,{hideSortIcon:!0,active:t===e.id,direction:t===e.id?r:"asc",onClick:(i=e.id,e=>{l(e,i)}),children:[e.label,t===e.id?(0,p.jsx)(s.c,{sx:{border:0,margin:-1,padding:0,width:"1px",height:"1px",overflow:"hidden",position:"absolute",whiteSpace:"nowrap",clip:"rect(0 0 0 0)"},children:"desc"===r?"sorted descending":"sorted ascending"}):null]})},e.id);var i}))]})})}var F=t(9e3),D=t(6931),N=t(3996),R=t(6880),I=t(476),y=t(3884),k=t(4296);function A(e){let{collapse:r,refferals:t,referenceNum:i}=e;return(0,p.jsx)(o.c,{children:(0,p.jsx)(c.c,{style:{paddingBottom:0,paddingTop:0},colSpan:4,children:(0,p.jsx)(I.c,{in:r,timeout:"auto",unmountOnExit:!0,children:(0,p.jsxs)(s.c,{sx:{margin:1,maxHeight:500,overflowY:"auto"},children:[(0,p.jsx)(R.c,{variant:"h6",gutterBottom:!0,component:"div",children:"Receiving Offices"}),(0,p.jsxs)(l.c,{"aria-label":"purchases",children:[(0,p.jsx)(w.c,{children:(0,p.jsxs)(o.c,{children:[(0,p.jsx)(c.c,{children:"Office"}),(0,p.jsx)(c.c,{children:"Status"}),(0,p.jsx)(c.c,{align:"right"})]})}),(0,p.jsx)(a.c,{children:t.map((e=>(0,p.jsxs)(o.c,{children:[(0,p.jsx)(c.c,{component:"th",scope:"row",children:(0,p.jsx)(R.c,{variant:"subtitle1",noWrap:!0,children:e.office})}),(0,p.jsx)(c.c,{children:(0,p.jsx)(y.c,{officeId:e.id,referenceNum:i,role:k.QJ.Director,status:e.status,width:200,showLabel:!1})})]},e.id)))})]})]})})})})}var E=t(2560);function P(e){const r=e.toLowerCase();return r.includes("ongoing")||r.includes("referred")?"warning":r.includes("finished")?"success":"info"}function T(e){let{officeId:r,document:t,onView:n,onEdit:s,onDelete:l}=e;const[a,d]=(0,i.useState)(null),[u,h]=(0,i.useState)(!1),[f,v]=(0,i.useState)(!1),m=e=>{n(e,t.referenceNum),d(null)};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(o.c,{hover:!0,tabIndex:-1,role:"checkbox",children:[void 0===r&&(0,p.jsx)(c.c,{children:(0,p.jsx)(x.c,{"aria-label":"expand row",size:"small",onClick:()=>v(!f),children:f?(0,p.jsx)(j.ov,{icon:"ic:baseline-expand-less"}):(0,p.jsx)(j.ov,{icon:"material-symbols:expand-more"})})}),(0,p.jsx)(c.c,{component:"th",scope:"row",children:(0,p.jsx)(F.c,{onClick:m,children:(0,p.jsx)(R.c,{variant:"subtitle2",noWrap:!0,children:`#${t.referenceNum}`})})}),(0,p.jsxs)(c.c,{sx:{minWidth:250},children:[(0,p.jsx)(R.c,{variant:"body2",children:t.subject.length>255?`${t.subject.slice(0,255)}...`:t.subject}),t.tag&&(0,p.jsx)(j.iM,{color:"info",children:t.tag})]}),(0,p.jsx)(c.c,{align:"right",sx:{minWidth:150},children:t.dateCreated}),(0,p.jsx)(c.c,{align:"right",children:t.receivedFrom}),(0,p.jsx)(c.c,{align:"right",sx:{maxWidth:200},children:t.referredTo}),(0,p.jsx)(c.c,{align:"right",sx:{width:50},children:(0,p.jsx)(j.iM,{color:P(t.status),children:(0,E.SI)(t.status)})}),(0,p.jsx)(c.c,{align:"right",sx:{width:30},children:(0,p.jsx)(x.c,{onClick:e=>{d(e.currentTarget)},children:(0,p.jsx)(j.ov,{icon:"eva:more-vertical-fill"})})})]}),void 0===r&&(0,p.jsx)(i.Suspense,{children:(0,p.jsx)(A,{collapse:f,referenceNum:t.referenceNum,refferals:t.referrals})}),(0,p.jsxs)(D.cp,{open:!!a,anchorEl:a,onClose:()=>{d(null)},anchorOrigin:{vertical:"top",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"right"},PaperProps:{sx:{width:140}},children:[(0,p.jsxs)(N.c,{onClick:m,children:[(0,p.jsx)(j.ov,{icon:"fluent-mdl2:review-solid",sx:{mr:2}}),"View"]}),void 0===r&&(0,p.jsxs)(N.c,{onClick:e=>{s(e,t.referenceNum),d(null)},children:[(0,p.jsx)(j.ov,{icon:"eva:edit-fill",sx:{mr:2}}),"Edit"]}),void 0===r&&(0,p.jsxs)(N.c,{onClick:()=>h(!0),sx:{color:"error.main"},children:[(0,p.jsx)(j.ov,{icon:"eva:trash-2-outline",sx:{mr:2}}),"Delete"]})]}),(0,p.jsx)(j._6,{open:u,onClose:()=>h(!1),onDelete:e=>{l(e,t.referenceNum),d(null),h(!1)}})]})}var W=t(9720),L=t(7596),O=t(3540),U=t(3055),$=t(8964);const z=(0,i.lazy)((()=>Promise.resolve().then(t.bind(t,1168)))),q=(0,i.lazy)((()=>Promise.resolve().then(t.bind(t,8280))));function B(e){return e.map((e=>e.split(" ").map((e=>isNaN(parseInt(e))?e.charAt(0).toUpperCase():`-${parseInt(e).toString()}`)).join(""))).join(", ")}function Q(e,r,t){return r[t]<e[t]?-1:r[t]>e[t]?1:0}function V(e){let{officerId:r,officeId:t,onRefresh:h,onView:f,onEdit:x}=e;const{data:v,error:m,refetch:g}=(0,W.UL)(U.aK,{variables:{officerId:r}}),{data:j,error:w}=(0,L.Q)($.G2),[S,F]=(0,i.useState)(!1),[D,N]=(0,i.useState)([]),[R,I]=(0,i.useState)(0),[y,k]=(0,i.useState)("asc"),[A,P]=(0,i.useState)("referenceNum"),[V,J]=(0,i.useState)(""),[M,Y]=(0,i.useState)(10),[G,H]=(0,i.useState)([]),[K,{error:_}]=(0,O.c)(U.sT);(0,i.useEffect)((()=>{v&&H(v.getDocuments.map((e=>{var r;return{referenceNum:e.referenceNum,subject:e.subject,receivedFrom:e.receivedFrom,referredTo:e.directorAssigned.length>0?e.directorAssigned.map((e=>`${e.firstName} ${e.lastName}`)).join(", "):B(e.referredTo.map((e=>e.office.name))),dateCreated:new Date(e.dateCreated).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),status:t?`${(null===(r=e.referredTo.find((e=>parseInt(e.office.id)===t)))||void 0===r?void 0:r.status.category)||"REFERRED"}`:e.status,tag:e.tag?(0,E.SI)(e.tag):"",referrals:e.referredTo.map((e=>({id:parseInt(e.office.id),office:e.office.name,status:e.status.category})))}})))}),[v,t]),(0,i.useEffect)((()=>{j&&g()}),[j,g]);const X=(0,i.useMemo)((()=>function(e,r){const t=e.map(((e,r)=>[e,r]));return t.sort(((e,t)=>{const i=r(e[0],t[0]);return 0!==i?i:e[1]-t[1]})),t.map((e=>e[0]))}(G.filter((e=>(e.referenceNum.includes(V)||e.subject.includes(V)||0===V.length)&&(D.includes(e.status.replace(/\d+/g,""))||D.includes(e.tag)||0===D.length))),function(e,r){return"desc"===e?(e,t)=>Q(e,t,r):(e,t)=>-Q(e,t,r)}(y,A)).slice(R*M,R*M+M)),[G,V,y,A,R,M,D]),Z=(e,r)=>f(r),ee=(e,r)=>x(r),re=async(e,r)=>{await K({variables:{referenceNum:r}}),await g()};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(n.c,{children:[(0,p.jsx)(b,{filterName:V,onRefresh:async()=>{await g(),h()},onFilterName:e=>{I(0),J(e.target.value)},onFilter:()=>F(!S)}),(0,p.jsx)(s.c,{sx:{overflow:"auto"},children:(0,p.jsx)(d.c,{children:(0,p.jsxs)(l.c,{sx:{minWidth:900},children:[(0,p.jsx)(C,{order:y,orderBy:A,officeId:t,onRequestSort:(e,r)=>{k(A===r&&"asc"===y?"desc":"asc"),P(r)},headLabel:[{id:"referenceNum",label:"Reference"},{id:"subject",label:"Subject",width:250},{id:"dateCreated",label:"Date",align:"right"},{id:"receivedFrom",label:"Received From",align:"right"},{id:"referredTo",label:"Referred To",align:"right"},{id:"status",label:"Status",align:"right",width:50},{id:"tag",align:"right",width:20}]}),(0,p.jsxs)(a.c,{children:[X.map((e=>(0,p.jsx)(T,{officeId:t,document:e,onView:Z,onEdit:ee,onDelete:re},e.referenceNum))),0===X.length&&(0,p.jsx)(o.c,{sx:{height:80},children:(0,p.jsx)(c.c,{align:"center",colSpan:6,children:"No results found."})})]})]})})}),(0,p.jsx)(u.c,{page:R,component:"div",count:G.length,rowsPerPage:M,onPageChange:(e,r)=>{I(r)},rowsPerPageOptions:[10,25,50],onRowsPerPageChange:e=>{I(0),Y(parseInt(e.target.value,10))}})]}),(0,p.jsx)(i.Suspense,{children:(0,p.jsx)(q,{open:S,selected:D,onFilter:e=>{const r=D.indexOf(e);let t=[];-1===r?t=t.concat(D,e):0===r?t=t.concat(D.slice(1)):r===D.length-1?t=t.concat(D.slice(0,-1)):r>0&&(t=t.concat(D.slice(0,r),D.slice(r+1))),N(t),I(0)},onClose:()=>F(!S),onClear:()=>N([]),filters:[{name:"Status",options:Array.from(new Set(G.map((e=>e.status.replace(/\d+/g,""))))).map((e=>({value:e,label:(0,E.SI)(e.replace(/\d+/g,""))})))},{name:"Tags",options:Array.from(new Set(G.filter((e=>e.tag)).map((e=>e.tag)))).map((e=>({value:e,label:(0,E.SI)(e)})))}]})}),(0,p.jsx)(i.Suspense,{children:(0,p.jsx)(z,{severity:"error",message:(null===m||void 0===m?void 0:m.message)||(null===w||void 0===w?void 0:w.message)||(null===_||void 0===_?void 0:_.message)})})]})}}}]);
//# sourceMappingURL=296.89f45d15.chunk.js.map