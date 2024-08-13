"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[336],{1336:(e,n,t)=>{t.r(n),t.d(n,{default:()=>R});var a=t(9060),r=t(2656),l=t(6773),i=t(4488),s=t(7667),c=t(9e3),o=t(5448),d=t(8960),u=t(4380),h=t(3996),m=t(7868),p=t.n(m),x=t(2892),v=t(7976),j=t(9732),g=t(3540),y=t(2496);const f={name:"",basis:"",frequency:"NONE",type:"HR"};function R(e){let{reportId:n,open:t,onClose:m}=e;const[R,{error:b}]=(0,j.U)(v.G2,{fetchPolicy:"no-cache"}),[D,S]=(0,a.useState)(f),[w,C]=(0,a.useState)(p()(new Date)),[I,N]=(0,a.useState)(p()(new Date)),{name:q,basis:E,frequency:A,type:B}=D,[O,{error:M}]=(0,g.c)(v.eA),[T,{error:W}]=(0,g.c)(v.AX);(0,a.useEffect)((()=>{n?R({variables:{id:n}}).then((e=>{let{data:n}=e;n&&(S({name:n.getReportById.name,basis:n.getReportById.basis,frequency:n.getReportById.frequency,type:n.getReportById.type}),C(p()(new Date(n.getReportById.localDue))),N(p()(new Date(n.getReportById.nationalDue))))})):(S(f),C(p()(new Date)),N(p()(new Date)))}),[n,R]);const k=e=>{S({...D,[e.target.name]:e.target.value})};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(r.c,{open:t,onClose:m,maxWidth:"sm",fullWidth:!0,children:(0,y.jsxs)("form",{onSubmit:async e=>{e.preventDefault(),n?await T({variables:{id:n,name:q,basis:E,type:B,frequency:A,localDue:w.toISOString(),nationalDue:I.toISOString()}}):await O({variables:{name:q,basis:E,type:B,frequency:A,localDue:w.toISOString(),nationalDue:I.toISOString()}}),S(f),C(p()(new Date)),N(p()(new Date)),m()},children:[(0,y.jsx)(l.c,{children:n?"Edit Report":"Create Report"}),(0,y.jsx)(i.c,{children:(0,y.jsxs)(o.cp,{container:!0,spacing:3,sx:{pt:2},children:[(0,y.jsx)(o.cp,{item:!0,xs:12,children:(0,y.jsx)(u.c,{name:"name",label:"Report Name",variant:"outlined",value:q,onChange:k,fullWidth:!0,required:!0})}),(0,y.jsx)(o.cp,{item:!0,xs:12,children:(0,y.jsx)(u.c,{name:"basis",label:"Report Basis",variant:"outlined",value:E,onChange:k,fullWidth:!0,required:!0})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsx)(x.I4,{label:"Next Regional Deadline",value:w,onChange:e=>{e&&C(e)}})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsx)(x.I4,{label:"Next National Deadline",value:I,onChange:e=>{e&&N(e)}})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsxs)(u.c,{name:"frequency",select:!0,label:"Frequency",variant:"outlined",value:A,onChange:k,required:!0,fullWidth:!0,children:[(0,y.jsx)(h.c,{value:"NONE",children:"None"}),(0,y.jsx)(h.c,{value:"MONTHLY",children:"Monthly"}),(0,y.jsx)(h.c,{value:"QUARTERLY",children:"Quarterly"}),(0,y.jsx)(h.c,{value:"SEMESTRAL",children:"Semestral"}),(0,y.jsx)(h.c,{value:"YEARLY",children:"Yearly"})]})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsxs)(u.c,{name:"type",select:!0,label:"Report Type",variant:"outlined",value:B,onChange:k,required:!0,fullWidth:!0,children:[(0,y.jsx)(h.c,{value:"HR",children:"Human Resource Report"}),(0,y.jsx)(h.c,{value:"ADMIN",children:"Administrative Report"})]})})]})}),(0,y.jsx)(s.c,{children:(0,y.jsxs)(d.c,{direction:"row",spacing:2,children:[(0,y.jsx)(c.c,{onClick:m,color:"inherit",children:"Cancel"}),(0,y.jsx)(c.c,{variant:"contained",color:"inherit",type:"submit",children:"Save"})]})})]})}),(0,y.jsx)(x.wR,{severity:"error",message:(null===M||void 0===M?void 0:M.message)||(null===b||void 0===b?void 0:b.message)||(null===W||void 0===W?void 0:W.message)})]})}},6773:(e,n,t)=>{t.d(n,{c:()=>v});var a=t(5072),r=t(5656),l=t(9060),i=t(9736),s=t(7067),c=t(6880),o=t(2556),d=t(2128),u=t(2172),h=t(6432),m=t(2496);const p=["className","id"],x=(0,o.cp)(c.c,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(e,n)=>n.root})({padding:"16px 24px",flex:"0 0 auto"}),v=l.forwardRef((function(e,n){const t=(0,d.C)({props:e,name:"MuiDialogTitle"}),{className:c,id:o}=t,v=(0,r.c)(t,p),j=t,g=(e=>{const{classes:n}=e;return(0,s.c)({root:["root"]},u.G,n)})(j),{titleId:y=o}=l.useContext(h.c);return(0,m.jsx)(x,(0,a.c)({component:"h2",className:(0,i.c)(g.root,c),ownerState:j,ref:n,variant:"h6",id:null!=o?o:y},v))}))}}]);
//# sourceMappingURL=336.a89057bd.chunk.js.map