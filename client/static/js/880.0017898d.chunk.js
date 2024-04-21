"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[880],{7880:(e,a,t)=>{t.r(a),t.d(a,{default:()=>p});var i=t(1712),s=t(5448),r=t(6880),n=t(4480),o=t(3540),l=t(5084),c=t(8964),d=t(2496);function m(){const{data:e,error:a,loading:t,refetch:i}=(0,n.U)(c.It,{fetchPolicy:"no-cache"}),[s,{error:r}]=(0,o.c)(c.aK),[m,{error:u}]=(0,o.c)(c.sz),[v,{error:b}]=(0,o.c)(c.i_);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Offices",items:e.getOffices.map((e=>({id:parseInt(e.id),label:e.name}))),onCreate:async(e,a)=>{await s({variables:{name:e}}),await i()},onUpdate:async(e,a,t)=>{await m({variables:{id:e,name:a}}),await i()},onDelete:async e=>{await v({variables:{id:e}}),await i()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===a||void 0===a?void 0:a.message)||(null===r||void 0===r?void 0:r.message)||(null===u||void 0===u?void 0:u.message)||(null===b||void 0===b?void 0:b.message)})]})}var u=t(3055);function v(){const{data:e,error:a,loading:t,refetch:i}=(0,n.U)(u.yu,{fetchPolicy:"no-cache"}),[s,{error:r}]=(0,o.c)(u.W6),[c,{error:m}]=(0,o.c)(u.oz),[v,{error:b}]=(0,o.c)(u.SM);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Document Purpose",items:e.getDocumentPurposes.map((e=>({id:parseInt(e.id),label:e.label}))),onCreate:async(e,a)=>{await s({variables:{label:e}}),await i()},onUpdate:async(e,a,t)=>{await c({variables:{id:e,label:a}}),await i()},onDelete:async e=>{await v({variables:{id:e}}),await i()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===a||void 0===a?void 0:a.message)||(null===r||void 0===r?void 0:r.message)||(null===m||void 0===m?void 0:m.message)||(null===b||void 0===b?void 0:b.message)})]})}function b(){const{data:e,error:a,loading:t,refetch:i}=(0,n.U)(u.SY,{fetchPolicy:"no-cache"}),[s,{error:r}]=(0,o.c)(u.CI),[c,{error:m}]=(0,o.c)(u.yA),[v,{error:b}]=(0,o.c)(u.An);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Document Status",items:e.getDocumentStatus.map((e=>({id:parseInt(e.id),label:e.label,category:e.category}))),categories:[{label:"Finished",value:"FINISHED"},{label:"Not Actionable",value:"NOT_ACTIONABLE"},{label:"Referred",value:"REFERRED"},{label:"Submitted",value:"SUBMITTED"}],onCreate:async(e,a)=>{a&&(await s({variables:{label:e,category:a}}),await i())},onUpdate:async(e,a,t)=>{t&&(await c({variables:{id:e,label:a,category:t}}),await i())},onDelete:async e=>{await v({variables:{id:e}}),await i()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===a||void 0===a?void 0:a.message)||(null===r||void 0===r?void 0:r.message)||(null===m||void 0===m?void 0:m.message)||(null===b||void 0===b?void 0:b.message)})]})}function x(){const{data:e,error:a,loading:t,refetch:i}=(0,n.U)(u.oV,{fetchPolicy:"no-cache"}),[s,{error:r}]=(0,o.c)(u.f_),[c,{error:m}]=(0,o.c)(u.gz),[v,{error:b}]=(0,o.c)(u.ED);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Document Types",items:e.getDocumentTypes.map((e=>({id:parseInt(e.id),label:e.label}))),onCreate:async(e,a)=>{await s({variables:{label:e}}),await i()},onUpdate:async(e,a,t)=>{await c({variables:{id:e,label:a}}),await i()},onDelete:async e=>{await v({variables:{id:e}}),await i()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===a||void 0===a?void 0:a.message)||(null===r||void 0===r?void 0:r.message)||(null===m||void 0===m?void 0:m.message)||(null===b||void 0===b?void 0:b.message)})]})}function g(){const{data:e,error:a,loading:t,refetch:i}=(0,n.U)(c.mq,{fetchPolicy:"no-cache"}),[s,{error:r}]=(0,o.c)(c.Iz),[m,{error:u}]=(0,o.c)(c.aG),[v,{error:b}]=(0,o.c)(c.ew);return(0,d.jsxs)(d.Fragment,{children:[!t&&e&&(0,d.jsx)(l.UX,{title:"Positions",items:e.getPositions.map((e=>({id:parseInt(e.id),label:e.label,category:e.role}))),categories:[{label:"Officer",value:"OFFICER"},{label:"Chief",value:"CHIEF"},{label:"Director",value:"DIRECTOR"},{label:"Superuser",value:"SUPERUSER"},{label:"HR Admin",value:"HR_ADMIN"}],onCreate:async(e,a)=>{a&&(await s({variables:{label:e,role:a}}),await i())},onUpdate:async(e,a,t)=>{t&&(await m({variables:{id:e,label:a,role:t}}),await i())},onDelete:async e=>{await v({variables:{id:e}}),await i()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===a||void 0===a?void 0:a.message)||(null===r||void 0===r?void 0:r.message)||(null===u||void 0===u?void 0:u.message)||(null===b||void 0===b?void 0:b.message)})]})}function p(){return(0,d.jsx)(i.c,{children:(0,d.jsxs)(s.cp,{container:!0,spacing:3,children:[(0,d.jsx)(s.cp,{item:!0,xs:12,children:(0,d.jsx)(r.c,{variant:"h4",children:"Settings"})}),(0,d.jsx)(s.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(m,{})}),(0,d.jsx)(s.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(v,{})}),(0,d.jsx)(s.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(x,{})}),(0,d.jsx)(s.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(b,{})}),(0,d.jsx)(s.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(g,{})})]})})}},1712:(e,a,t)=>{t.d(a,{c:()=>j});var i=t(5656),s=t(5072),r=t(9060),n=t(9736),o=t(5336),l=t(3448),c=t(1412),d=t(3596),m=t(7736),u=t(4276),v=t(2496);const b=["className","component","disableGutters","fixed","maxWidth","classes"],x=(0,u.c)(),g=(0,m.c)("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,a)=>{const{ownerState:t}=e;return[a.root,a["maxWidth".concat((0,o.c)(String(t.maxWidth)))],t.fixed&&a.fixed,t.disableGutters&&a.disableGutters]}}),p=e=>(0,d.c)({props:e,name:"MuiContainer",defaultTheme:x});var h=t(5832),f=t(2556),w=t(3456);const y=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{createStyledComponent:a=g,useThemeProps:t=p,componentName:d="MuiContainer"}=e,m=a((e=>{let{theme:a,ownerState:t}=e;return(0,s.c)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",display:"block"},!t.disableGutters&&{paddingLeft:a.spacing(2),paddingRight:a.spacing(2),[a.breakpoints.up("sm")]:{paddingLeft:a.spacing(3),paddingRight:a.spacing(3)}})}),(e=>{let{theme:a,ownerState:t}=e;return t.fixed&&Object.keys(a.breakpoints.values).reduce(((e,t)=>{const i=t,s=a.breakpoints.values[i];return 0!==s&&(e[a.breakpoints.up(i)]={maxWidth:"".concat(s).concat(a.breakpoints.unit)}),e}),{})}),(e=>{let{theme:a,ownerState:t}=e;return(0,s.c)({},"xs"===t.maxWidth&&{[a.breakpoints.up("xs")]:{maxWidth:Math.max(a.breakpoints.values.xs,444)}},t.maxWidth&&"xs"!==t.maxWidth&&{[a.breakpoints.up(t.maxWidth)]:{maxWidth:"".concat(a.breakpoints.values[t.maxWidth]).concat(a.breakpoints.unit)}})})),u=r.forwardRef((function(e,a){const r=t(e),{className:u,component:x="div",disableGutters:g=!1,fixed:p=!1,maxWidth:h="lg"}=r,f=(0,i.c)(r,b),w=(0,s.c)({},r,{component:x,disableGutters:g,fixed:p,maxWidth:h}),y=((e,a)=>{const{classes:t,fixed:i,disableGutters:s,maxWidth:r}=e,n={root:["root",r&&"maxWidth".concat((0,o.c)(String(r))),i&&"fixed",s&&"disableGutters"]};return(0,c.c)(n,(e=>(0,l.cp)(a,e)),t)})(w,d);return(0,v.jsx)(m,(0,s.c)({as:x,ownerState:w,className:(0,n.c)(y.root,u),ref:a},f))}));return u}({createStyledComponent:(0,f.cp)("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,a)=>{const{ownerState:t}=e;return[a.root,a["maxWidth".concat((0,h.c)(String(t.maxWidth)))],t.fixed&&a.fixed,t.disableGutters&&a.disableGutters]}}),useThemeProps:e=>(0,w.c)({props:e,name:"MuiContainer"})}),j=y}}]);
//# sourceMappingURL=880.0017898d.chunk.js.map