"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[336],{1336:(e,n,t)=>{t.r(n),t.d(n,{default:()=>R});var a=t(9060),r=t(2656),i=t(6773),l=t(4488),s=t(7667),c=t(9e3),o=t(5448),d=t(8960),u=t(4380),h=t(3996),p=t(7868),m=t.n(p),x=t(5084),v=t(7976),g=t(9732),j=t(3540),y=t(2496);const f={name:"",basis:"",frequency:"NONE",type:"HR"};function R(e){let{reportId:n,open:t,onClose:p}=e;const[R,{error:b}]=(0,g.U)(v.G2,{fetchPolicy:"no-cache"}),[D,w]=(0,a.useState)(f),[I,C]=(0,a.useState)(m()(new Date)),[N,S]=(0,a.useState)(m()(new Date)),{name:q,basis:B,frequency:O,type:W}=D,[k,{error:A}]=(0,j.c)(v.eA),[E,{error:M}]=(0,j.c)(v.AX);(0,a.useEffect)((()=>{n?R({variables:{id:n}}).then((e=>{let{data:n}=e;n&&(w({name:n.getReportById.name,basis:n.getReportById.basis,frequency:n.getReportById.frequency,type:n.getReportById.type}),C(m()(new Date(n.getReportById.localDue))),S(m()(new Date(n.getReportById.nationalDue))))})):(w(f),C(m()(new Date)),S(m()(new Date)))}),[n,R]);const H=e=>{w({...D,[e.target.name]:e.target.value})};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(r.c,{open:t,onClose:p,maxWidth:"sm",fullWidth:!0,children:(0,y.jsxs)("form",{onSubmit:async e=>{e.preventDefault(),n?await E({variables:{id:n,name:q,basis:B,type:W,frequency:O,localDue:I.toISOString(),nationalDue:N.toISOString()}}):await k({variables:{name:q,basis:B,type:W,frequency:O,localDue:I.toISOString(),nationalDue:N.toISOString()}}),w(f),C(m()(new Date)),S(m()(new Date)),p()},children:[(0,y.jsx)(i.c,{children:n?"Edit Report":"Create Report"}),(0,y.jsx)(l.c,{children:(0,y.jsxs)(o.cp,{container:!0,spacing:3,sx:{pt:2},children:[(0,y.jsx)(o.cp,{item:!0,xs:12,children:(0,y.jsx)(u.c,{name:"name",label:"Report Name",variant:"outlined",value:q,onChange:H,fullWidth:!0,required:!0})}),(0,y.jsx)(o.cp,{item:!0,xs:12,children:(0,y.jsx)(u.c,{name:"basis",label:"Report Basis",variant:"outlined",value:B,onChange:H,fullWidth:!0,required:!0})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsx)(x.I4,{label:"Next Regional Deadline",value:I,onChange:e=>{e&&C(e)}})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsx)(x.I4,{label:"Next National Deadline",value:N,onChange:e=>{e&&S(e)}})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsxs)(u.c,{name:"frequency",select:!0,label:"Frequency",variant:"outlined",value:O,onChange:H,required:!0,fullWidth:!0,children:[(0,y.jsx)(h.c,{value:"NONE",children:"None"}),(0,y.jsx)(h.c,{value:"MONTHLY",children:"Monthly"}),(0,y.jsx)(h.c,{value:"YEARLY",children:"Yearly"})]})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsxs)(u.c,{name:"type",select:!0,label:"Report Type",variant:"outlined",value:W,onChange:H,required:!0,fullWidth:!0,children:[(0,y.jsx)(h.c,{value:"HR",children:"Human Resource Report"}),(0,y.jsx)(h.c,{value:"ADMIN",children:"Administrative Report"})]})})]})}),(0,y.jsx)(s.c,{children:(0,y.jsxs)(d.c,{direction:"row",spacing:2,children:[(0,y.jsx)(c.c,{onClick:p,color:"inherit",children:"Cancel"}),(0,y.jsx)(c.c,{variant:"contained",color:"inherit",type:"submit",children:"Save"})]})})]})}),(0,y.jsx)(x.wR,{severity:"error",message:(null===A||void 0===A?void 0:A.message)||(null===b||void 0===b?void 0:b.message)||(null===M||void 0===M?void 0:M.message)})]})}},6773:(e,n,t)=>{t.d(n,{c:()=>v});var a=t(5072),r=t(5656),i=t(9060),l=t(9736),s=t(1412),c=t(6880),o=t(2556),d=t(3456),u=t(2172),h=t(6432),p=t(2496);const m=["className","id"],x=(0,o.cp)(c.c,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(e,n)=>n.root})({padding:"16px 24px",flex:"0 0 auto"}),v=i.forwardRef((function(e,n){const t=(0,d.c)({props:e,name:"MuiDialogTitle"}),{className:c,id:o}=t,v=(0,r.c)(t,m),g=t,j=(e=>{const{classes:n}=e;return(0,s.c)({root:["root"]},u.G,n)})(g),{titleId:y=o}=i.useContext(h.c);return(0,p.jsx)(x,(0,a.c)({component:"h2",className:(0,l.c)(j.root,c),ownerState:g,ref:n,variant:"h6",id:null!=o?o:y},v))}))}}]);
//# sourceMappingURL=336.794da0a1.chunk.js.map