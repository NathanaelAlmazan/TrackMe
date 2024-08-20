"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[880],{7880:(e,t,a)=>{a.r(t),a.d(t,{default:()=>x});var r=a(2020),i=a(5448),n=a(6880),o=a(9720),s=a(3540),l=a(1424),c=a(8964),d=a(2496);function u(){const{data:e,error:t,loading:a,refetch:r}=(0,o.UL)(c.It,{fetchPolicy:"no-cache"}),[i,{error:n}]=(0,s.c)(c.aK),[u,{error:v}]=(0,s.c)(c.sz),[m,{error:g}]=(0,s.c)(c.i_);return(0,d.jsxs)(d.Fragment,{children:[!a&&e&&(0,d.jsx)(l.UX,{title:"Offices",items:e.getOffices.map((e=>({id:parseInt(e.id),label:e.name}))),onCreate:async(e,t)=>{await i({variables:{name:e}}),await r()},onUpdate:async(e,t,a)=>{await u({variables:{id:e,name:t}}),await r()},onDelete:async e=>{await m({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===t||void 0===t?void 0:t.message)||(null===n||void 0===n?void 0:n.message)||(null===v||void 0===v?void 0:v.message)||(null===g||void 0===g?void 0:g.message)})]})}var v=a(3055);function m(){const{data:e,error:t,loading:a,refetch:r}=(0,o.UL)(v.yu,{fetchPolicy:"no-cache"}),[i,{error:n}]=(0,s.c)(v.W6),[c,{error:u}]=(0,s.c)(v.oz),[m,{error:g}]=(0,s.c)(v.SM);return(0,d.jsxs)(d.Fragment,{children:[!a&&e&&(0,d.jsx)(l.UX,{title:"Document Purpose",items:e.getDocumentPurposes.map((e=>({id:parseInt(e.id),label:e.label}))),onCreate:async(e,t)=>{await i({variables:{label:e}}),await r()},onUpdate:async(e,t,a)=>{await c({variables:{id:e,label:t}}),await r()},onDelete:async e=>{await m({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===t||void 0===t?void 0:t.message)||(null===n||void 0===n?void 0:n.message)||(null===u||void 0===u?void 0:u.message)||(null===g||void 0===g?void 0:g.message)})]})}function g(){const{data:e,error:t,loading:a,refetch:r}=(0,o.UL)(v.SY,{fetchPolicy:"no-cache"}),[i,{error:n}]=(0,s.c)(v.CI),[c,{error:u}]=(0,s.c)(v.yA),[m,{error:g}]=(0,s.c)(v.An);return(0,d.jsxs)(d.Fragment,{children:[!a&&e&&(0,d.jsx)(l.UX,{title:"Document Status",items:e.getDocumentStatus.map((e=>({id:parseInt(e.id),label:e.label,category:e.category}))),categories:[{label:"Finished",value:"FINISHED"},{label:"Not Actionable",value:"NOT_ACTIONABLE"},{label:"Referred",value:"REFERRED"},{label:"Submitted",value:"SUBMITTED"},{label:"For Approval",value:"FOR_APPROVAL"},{label:"For Review",value:"FOR_REVIEW"},{label:"For Correction",value:"FOR_CORRECTION"},{label:"For Revision",value:"FOR_REVISION"},{label:"Update Report",value:"UPDATE_REPORT"}],onCreate:async(e,t)=>{t&&(await i({variables:{label:e,category:t}}),await r())},onUpdate:async(e,t,a)=>{a&&(await c({variables:{id:e,label:t,category:a}}),await r())},onDelete:async e=>{await m({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===t||void 0===t?void 0:t.message)||(null===n||void 0===n?void 0:n.message)||(null===u||void 0===u?void 0:u.message)||(null===g||void 0===g?void 0:g.message)})]})}function p(){const{data:e,error:t,loading:a,refetch:r}=(0,o.UL)(v.oV,{fetchPolicy:"no-cache"}),[i,{error:n}]=(0,s.c)(v.f_),[c,{error:u}]=(0,s.c)(v.gz),[m,{error:g}]=(0,s.c)(v.ED);return(0,d.jsxs)(d.Fragment,{children:[!a&&e&&(0,d.jsx)(l.UX,{title:"Document Types",items:e.getDocumentTypes.map((e=>({id:parseInt(e.id),label:e.label}))),onCreate:async(e,t)=>{await i({variables:{label:e}}),await r()},onUpdate:async(e,t,a)=>{await c({variables:{id:e,label:t}}),await r()},onDelete:async e=>{await m({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===t||void 0===t?void 0:t.message)||(null===n||void 0===n?void 0:n.message)||(null===u||void 0===u?void 0:u.message)||(null===g||void 0===g?void 0:g.message)})]})}function b(){const{data:e,error:t,loading:a,refetch:r}=(0,o.UL)(c.mq,{fetchPolicy:"no-cache"}),[i,{error:n}]=(0,s.c)(c.Iz),[u,{error:v}]=(0,s.c)(c.aG),[m,{error:g}]=(0,s.c)(c.ew);return(0,d.jsxs)(d.Fragment,{children:[!a&&e&&(0,d.jsx)(l.UX,{title:"Positions",items:e.getPositions.map((e=>({id:parseInt(e.id),label:e.label,category:e.role}))),categories:[{label:"Officer",value:"OFFICER"},{label:"Chief",value:"CHIEF"},{label:"Director",value:"DIRECTOR"},{label:"Superuser",value:"SUPERUSER"},{label:"HR Admin",value:"HR_ADMIN"}],onCreate:async(e,t)=>{t&&(await i({variables:{label:e,role:t}}),await r())},onUpdate:async(e,t,a)=>{a&&(await u({variables:{id:e,label:t,role:a}}),await r())},onDelete:async e=>{await m({variables:{id:e}}),await r()}}),(0,d.jsx)(l.wR,{severity:"error",message:(null===t||void 0===t?void 0:t.message)||(null===n||void 0===n?void 0:n.message)||(null===v||void 0===v?void 0:v.message)||(null===g||void 0===g?void 0:g.message)})]})}function x(){return(0,d.jsx)(r.c,{children:(0,d.jsxs)(i.cp,{container:!0,spacing:3,children:[(0,d.jsx)(i.cp,{item:!0,xs:12,children:(0,d.jsx)(n.c,{variant:"h4",children:"Settings"})}),(0,d.jsx)(i.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(u,{})}),(0,d.jsx)(i.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(m,{})}),(0,d.jsx)(i.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(p,{})}),(0,d.jsx)(i.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(g,{})}),(0,d.jsx)(i.cp,{item:!0,xs:12,sm:6,md:4,children:(0,d.jsx)(b,{})})]})})}},2020:(e,t,a)=>{a.d(t,{c:()=>R});var r=a(5656),i=a(5072),n=a(9060),o=a(9736),s=a(816),l=a(7067),c=a(5152),d=a(6628),u=a(1512),v=a(9948),m=a(2496);const g=["className","component","disableGutters","fixed","maxWidth","classes"],p=(0,v.c)(),b=(0,u.c)("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,t[`maxWidth${(0,c.c)(String(a.maxWidth))}`],a.fixed&&t.fixed,a.disableGutters&&t.disableGutters]}}),x=e=>(0,d.c)({props:e,name:"MuiContainer",defaultTheme:p});var h=a(5832),f=a(2556),w=a(2128);const y=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{createStyledComponent:t=b,useThemeProps:a=x,componentName:d="MuiContainer"}=e,u=t((e=>{let{theme:t,ownerState:a}=e;return(0,i.c)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",display:"block"},!a.disableGutters&&{paddingLeft:t.spacing(2),paddingRight:t.spacing(2),[t.breakpoints.up("sm")]:{paddingLeft:t.spacing(3),paddingRight:t.spacing(3)}})}),(e=>{let{theme:t,ownerState:a}=e;return a.fixed&&Object.keys(t.breakpoints.values).reduce(((e,a)=>{const r=a,i=t.breakpoints.values[r];return 0!==i&&(e[t.breakpoints.up(r)]={maxWidth:`${i}${t.breakpoints.unit}`}),e}),{})}),(e=>{let{theme:t,ownerState:a}=e;return(0,i.c)({},"xs"===a.maxWidth&&{[t.breakpoints.up("xs")]:{maxWidth:Math.max(t.breakpoints.values.xs,444)}},a.maxWidth&&"xs"!==a.maxWidth&&{[t.breakpoints.up(a.maxWidth)]:{maxWidth:`${t.breakpoints.values[a.maxWidth]}${t.breakpoints.unit}`}})})),v=n.forwardRef((function(e,t){const n=a(e),{className:v,component:p="div",disableGutters:b=!1,fixed:x=!1,maxWidth:h="lg"}=n,f=(0,r.c)(n,g),w=(0,i.c)({},n,{component:p,disableGutters:b,fixed:x,maxWidth:h}),y=((e,t)=>{const{classes:a,fixed:r,disableGutters:i,maxWidth:n}=e,o={root:["root",n&&`maxWidth${(0,c.c)(String(n))}`,r&&"fixed",i&&"disableGutters"]};return(0,l.c)(o,(e=>(0,s.cp)(t,e)),a)})(w,d);return(0,m.jsx)(u,(0,i.c)({as:p,ownerState:w,className:(0,o.c)(y.root,v),ref:t},f))}));return v}({createStyledComponent:(0,f.cp)("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,t[`maxWidth${(0,h.c)(String(a.maxWidth))}`],a.fixed&&t.fixed,a.disableGutters&&t.disableGutters]}}),useThemeProps:e=>(0,w.C)({props:e,name:"MuiContainer"})}),R=y},3540:(e,t,a)=>{a.d(t,{c:()=>u});var r=a(7328),i=a(9528),n=a(6172),o=a(3520),s=a(9179),l=a(4056),c=a(1579),d=a(4268);function u(e,t){var a=(0,c.y)(null===t||void 0===t?void 0:t.client);(0,s.Y5)(e,s.UT.Mutation);var u=i.useState({called:!1,loading:!1,client:a}),v=u[0],m=u[1],g=i.useRef({result:v,mutationId:0,isMounted:!0,client:a,mutation:e,options:t});(0,d.M)((function(){Object.assign(g.current,{client:a,options:t,mutation:e})}));var p=i.useCallback((function(e){void 0===e&&(e={});var t=g.current,a=t.options,i=t.mutation,s=(0,r.C3)((0,r.C3)({},a),{mutation:i}),c=e.client||g.current.client;g.current.result.loading||s.ignoreResults||!g.current.isMounted||m(g.current.result={loading:!0,error:void 0,data:void 0,called:!0,client:c});var d=++g.current.mutationId,u=(0,n.I)(s,e);return c.mutate(u).then((function(t){var a,r,i=t.data,n=t.errors,s=n&&n.length>0?new l._M({graphQLErrors:n}):void 0,v=e.onError||(null===(a=g.current.options)||void 0===a?void 0:a.onError);if(s&&v&&v(s,u),d===g.current.mutationId&&!u.ignoreResults){var p={called:!0,loading:!1,data:i,error:s,client:c};g.current.isMounted&&!(0,o.y)(g.current.result,p)&&m(g.current.result=p)}var b=e.onCompleted||(null===(r=g.current.options)||void 0===r?void 0:r.onCompleted);return s||null===b||void 0===b||b(t.data,u),t})).catch((function(t){var a;if(d===g.current.mutationId&&g.current.isMounted){var r={loading:!1,error:t,data:void 0,called:!0,client:c};(0,o.y)(g.current.result,r)||m(g.current.result=r)}var i=e.onError||(null===(a=g.current.options)||void 0===a?void 0:a.onError);if(i)return i(t,u),{data:void 0,errors:t};throw t}))}),[]),b=i.useCallback((function(){if(g.current.isMounted){var e={called:!1,loading:!1,client:g.current.client};Object.assign(g.current,{mutationId:0,result:e}),m(e)}}),[]);return i.useEffect((function(){var e=g.current;return e.isMounted=!0,function(){e.isMounted=!1}}),[]),[p,(0,r.C3)({reset:b},v)]}}}]);
//# sourceMappingURL=880.47c2f1f0.chunk.js.map