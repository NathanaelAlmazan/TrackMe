"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[896],{4896:(e,t,i)=>{i.r(t),i.d(t,{default:()=>w});var s=i(9060),n=i(5448),o=i(8960),c=i(9e3),r=i(6880),a=i(1712),d=i(5084),l=i(4480),u=i(8504),m=i(3055),x=i(8964),h=i(4296),p=i(4194),f=i(2496);const g=(0,s.lazy)((()=>Promise.all([i.e(696),i.e(156)]).then(i.bind(i,2156)))),b=(0,s.lazy)((()=>Promise.all([i.e(608),i.e(64)]).then(i.bind(i,8064)))),v=(0,s.lazy)((()=>Promise.all([i.e(676),i.e(32)]).then(i.bind(i,8032))));function j(e,t){if(t)return e&&[h.QJ.Superuser,h.QJ.Director].includes(e)?void 0:parseInt(t)}function w(){const{uuid:e,office:t,role:i}=(0,p.Cq)((e=>e.auth)),{data:h,error:w,refetch:S}=(0,l.U)(m.wt,{variables:{officeId:j(i,t)}}),{data:k,error:W}=(0,u.Q)(x.G2);(0,s.useEffect)((()=>{k&&S()}),[k,S]);const[C,G]=s.useState(!1),[R,y]=s.useState(!1),[I,N]=s.useState(null),Q=()=>{G(!C),N(null)};return(0,f.jsxs)(a.c,{children:[(0,f.jsxs)(o.c,{direction:"row",alignItems:"center",justifyContent:"space-between",mb:5,children:[(0,f.jsx)(r.c,{variant:"h4",children:"Documents"}),void 0===j(i,t)&&(0,f.jsx)(c.c,{onClick:Q,variant:"contained",color:"inherit",startIcon:(0,f.jsx)(d.ov,{icon:"eva:plus-fill"}),children:"Create"})]}),(0,f.jsxs)(n.cp,{container:!0,spacing:2,children:[(0,f.jsx)(n.cp,{item:!0,xs:12,sm:6,md:3,children:(0,f.jsx)(d.aQ,{title:"Referred",total:h?h.getDocumentStatistics.referred:0,color:"success",icon:(0,f.jsx)(d.ov,{icon:"ic:twotone-forward-to-inbox",sx:{width:64,height:64}})})}),(0,f.jsx)(n.cp,{item:!0,xs:12,sm:6,md:3,children:(0,f.jsx)(d.aQ,{title:"Closed",total:h?h.getDocumentStatistics.closed:0,color:"success",icon:(0,f.jsx)(d.ov,{icon:"ep:finished",sx:{width:64,height:64}})})}),(0,f.jsx)(n.cp,{item:!0,xs:12,sm:6,md:3,children:(0,f.jsx)(d.aQ,{title:"Ongoing",total:h?h.getDocumentStatistics.ongoing:0,color:"success",icon:(0,f.jsx)(d.ov,{icon:"fluent-mdl2:processing",sx:{width:64,height:64}})})}),(0,f.jsx)(n.cp,{item:!0,xs:12,sm:6,md:3,children:(0,f.jsx)(d.aQ,{title:"Not Actionable",total:h?h.getDocumentStatistics.noaction:0,color:"success",icon:(0,f.jsx)(d.ov,{icon:"ic:twotone-sticky-note-2",sx:{width:64,height:64}})})}),e&&(0,f.jsx)(n.cp,{item:!0,xs:12,children:(0,f.jsx)(v,{officerId:e,officeId:j(i,t),onRefresh:()=>S(),onView:e=>{N(e),y(!R)},onEdit:e=>{N(e),G(!0)}})})]}),(0,f.jsx)(s.Suspense,{children:C&&e&&(0,f.jsx)(g,{open:C,officerId:e,referenceNum:I,onClose:Q})}),I&&e&&i&&(0,f.jsx)(s.Suspense,{children:(0,f.jsx)(b,{open:R,role:i,officerId:e,referenceNum:I,onClose:()=>{y(!1),N(null)},officeId:j(i,t)})}),(0,f.jsx)(d.wR,{severity:"error",message:(null===w||void 0===w?void 0:w.message)||(null===W||void 0===W?void 0:W.message)})]})}},1712:(e,t,i)=>{i.d(t,{c:()=>S});var s=i(5656),n=i(5072),o=i(9060),c=i(9736),r=i(5336),a=i(3448),d=i(1412),l=i(3596),u=i(7736),m=i(4276),x=i(2496);const h=["className","component","disableGutters","fixed","maxWidth","classes"],p=(0,m.c)(),f=(0,u.c)("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:i}=e;return[t.root,t["maxWidth".concat((0,r.c)(String(i.maxWidth)))],i.fixed&&t.fixed,i.disableGutters&&t.disableGutters]}}),g=e=>(0,l.c)({props:e,name:"MuiContainer",defaultTheme:p});var b=i(5832),v=i(2556),j=i(3456);const w=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{createStyledComponent:t=f,useThemeProps:i=g,componentName:l="MuiContainer"}=e,u=t((e=>{let{theme:t,ownerState:i}=e;return(0,n.c)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",display:"block"},!i.disableGutters&&{paddingLeft:t.spacing(2),paddingRight:t.spacing(2),[t.breakpoints.up("sm")]:{paddingLeft:t.spacing(3),paddingRight:t.spacing(3)}})}),(e=>{let{theme:t,ownerState:i}=e;return i.fixed&&Object.keys(t.breakpoints.values).reduce(((e,i)=>{const s=i,n=t.breakpoints.values[s];return 0!==n&&(e[t.breakpoints.up(s)]={maxWidth:"".concat(n).concat(t.breakpoints.unit)}),e}),{})}),(e=>{let{theme:t,ownerState:i}=e;return(0,n.c)({},"xs"===i.maxWidth&&{[t.breakpoints.up("xs")]:{maxWidth:Math.max(t.breakpoints.values.xs,444)}},i.maxWidth&&"xs"!==i.maxWidth&&{[t.breakpoints.up(i.maxWidth)]:{maxWidth:"".concat(t.breakpoints.values[i.maxWidth]).concat(t.breakpoints.unit)}})})),m=o.forwardRef((function(e,t){const o=i(e),{className:m,component:p="div",disableGutters:f=!1,fixed:g=!1,maxWidth:b="lg"}=o,v=(0,s.c)(o,h),j=(0,n.c)({},o,{component:p,disableGutters:f,fixed:g,maxWidth:b}),w=((e,t)=>{const{classes:i,fixed:s,disableGutters:n,maxWidth:o}=e,c={root:["root",o&&"maxWidth".concat((0,r.c)(String(o))),s&&"fixed",n&&"disableGutters"]};return(0,d.c)(c,(e=>(0,a.cp)(t,e)),i)})(j,l);return(0,x.jsx)(u,(0,n.c)({as:p,ownerState:j,className:(0,c.c)(w.root,m),ref:t},v))}));return m}({createStyledComponent:(0,v.cp)("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:i}=e;return[t.root,t["maxWidth".concat((0,b.c)(String(i.maxWidth)))],i.fixed&&t.fixed,i.disableGutters&&t.disableGutters]}}),useThemeProps:e=>(0,j.c)({props:e,name:"MuiContainer"})}),S=w}}]);
//# sourceMappingURL=896.c9c26709.chunk.js.map