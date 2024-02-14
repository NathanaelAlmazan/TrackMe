"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[336],{1336:(e,n,t)=>{t.r(n),t.d(n,{default:()=>b});var r=t(9060),a=t(2656),c=t(6773),i=t(4488),l=t(7667),s=t(9e3),o=t(5448),u=t(8960),d=t(8320),h=t(9344),f=t(7868),v=t.n(f),p=t(2044),x=t(7976),m=t(9732),g=t(3540),y=t(2496);const j={name:"",basis:"",frequency:"NONE"};function b(e){let{reportId:n,open:t,onClose:f}=e;const[b,{error:C}]=(0,m.U)(x.G2,{fetchPolicy:"no-cache"}),[D,R]=(0,r.useState)(j),[w,I]=(0,r.useState)(v()(new Date)),[S,q]=(0,r.useState)(v()(new Date)),{name:N,basis:O,frequency:k}=D,[E,{error:M}]=(0,g.c)(x.eA),[P,{error:W}]=(0,g.c)(x.AX);(0,r.useEffect)((()=>{n?b({variables:{id:n}}).then((e=>{let{data:n}=e;n&&(R({name:n.getReportById.name,basis:n.getReportById.basis,frequency:n.getReportById.frequency}),I(v()(new Date(n.getReportById.localDue))),q(v()(new Date(n.getReportById.nationalDue))))})):(R(j),I(v()(new Date)),q(v()(new Date)))}),[n,b]);const B=e=>{R({...D,[e.target.name]:e.target.value})};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(a.c,{open:t,onClose:f,maxWidth:"sm",fullWidth:!0,children:(0,y.jsxs)("form",{onSubmit:async e=>{e.preventDefault(),n?await P({variables:{id:n,name:N,basis:O,frequency:k,localDue:w.toISOString(),nationalDue:S.toISOString()}}):await E({variables:{name:N,basis:O,frequency:k,localDue:w.toISOString(),nationalDue:S.toISOString()}}),R(j),I(v()(new Date)),q(v()(new Date)),f()},children:[(0,y.jsx)(c.c,{children:n?"Edit Report":"Create Report"}),(0,y.jsx)(i.c,{children:(0,y.jsxs)(o.cp,{container:!0,spacing:3,sx:{pt:2},children:[(0,y.jsx)(o.cp,{item:!0,xs:12,children:(0,y.jsx)(d.c,{name:"name",label:"Report Name",variant:"outlined",value:N,onChange:B,fullWidth:!0,required:!0})}),(0,y.jsx)(o.cp,{item:!0,xs:12,children:(0,y.jsx)(d.c,{name:"basis",label:"Report Basis",variant:"outlined",value:O,onChange:B,fullWidth:!0,required:!0})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsx)(p.I4,{label:"Next Regional Deadline",value:w,onChange:e=>{e&&I(e)}})}),(0,y.jsx)(o.cp,{item:!0,xs:12,sm:6,md:6,children:(0,y.jsx)(p.I4,{label:"Next National Deadline",value:S,onChange:e=>{e&&q(e)}})}),(0,y.jsx)(o.cp,{item:!0,xs:12,children:(0,y.jsxs)(d.c,{name:"frequency",select:!0,label:"Frequency",variant:"outlined",value:k,onChange:B,required:!0,fullWidth:!0,children:[(0,y.jsx)(h.c,{value:"NONE",children:"None"}),(0,y.jsx)(h.c,{value:"WEEKLY",children:"Weekly"}),(0,y.jsx)(h.c,{value:"MONTHLY",children:"Monthly"}),(0,y.jsx)(h.c,{value:"YEARLY",children:"Yearly"})]})})]})}),(0,y.jsx)(l.c,{children:(0,y.jsxs)(u.c,{direction:"row",spacing:2,children:[(0,y.jsx)(s.c,{onClick:f,color:"inherit",children:"Cancel"}),(0,y.jsx)(s.c,{variant:"contained",color:"inherit",type:"submit",children:"Save"})]})})]})}),(0,y.jsx)(p.wR,{severity:"error",message:(null===M||void 0===M?void 0:M.message)||(null===C||void 0===C?void 0:C.message)||(null===W||void 0===W?void 0:W.message)})]})}},6773:(e,n,t)=>{t.d(n,{c:()=>x});var r=t(5072),a=t(5656),c=t(9060),i=t(9736),l=t(1412),s=t(6880),o=t(2556),u=t(3456),d=t(2172),h=t(6432),f=t(2496);const v=["className","id"],p=(0,o.cp)(s.c,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(e,n)=>n.root})({padding:"16px 24px",flex:"0 0 auto"}),x=c.forwardRef((function(e,n){const t=(0,u.c)({props:e,name:"MuiDialogTitle"}),{className:s,id:o}=t,x=(0,a.c)(t,v),m=t,g=(e=>{const{classes:n}=e;return(0,l.c)({root:["root"]},d.G,n)})(m),{titleId:y=o}=c.useContext(h.c);return(0,f.jsx)(p,(0,r.c)({component:"h2",className:(0,i.c)(g.root,s),ownerState:m,ref:n,variant:"h6",id:null!=o?o:y},x))}))},9732:(e,n,t)=>{t.d(n,{U:()=>o});var r=t(7328),a=t(9528),c=t(2200),i=t(4480),l=t(3960),s=["refetch","reobserve","fetchMore","updateQuery","startPolling","subscribeToMore"];function o(e,n){var t,o=a.useRef(),u=a.useRef(),d=a.useRef(),h=(0,c.I)(n,o.current||{}),f=null!==(t=null===h||void 0===h?void 0:h.query)&&void 0!==t?t:e;u.current=n,d.current=f;var v=(0,i.a)((0,l.y)(n&&n.client),f),p=v.useQuery((0,r.C3)((0,r.C3)({},h),{skip:!o.current})),x=p.observable.options.initialFetchPolicy||v.getDefaultFetchPolicy(),m=Object.assign(p,{called:!!o.current}),g=a.useMemo((function(){for(var e={},n=function(n){var t=m[n];e[n]=function(){return o.current||(o.current=Object.create(null),v.forceUpdateState()),t.apply(this,arguments)}},t=0,r=s;t<r.length;t++){n(r[t])}return e}),[]);Object.assign(m,g);var y=a.useCallback((function(e){o.current=e?(0,r.C3)((0,r.C3)({},e),{fetchPolicy:e.fetchPolicy||x}):{fetchPolicy:x};var n=(0,c.I)(u.current,(0,r.C3)({query:d.current},o.current)),t=v.executeQuery((0,r.C3)((0,r.C3)({},n),{skip:!1})).then((function(e){return Object.assign(e,g)}));return t.catch((function(){})),t}),[]);return[y,m]}}}]);
//# sourceMappingURL=336.ce203ca6.chunk.js.map