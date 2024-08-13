"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[14],{3014:(e,i,t)=>{t.r(i),t.d(i,{default:()=>A});var n=t(9060),s=t(3692),r=t(7256),c=t(3856),a=t(9504),o=t(700),l=t(7454),d=t(9904),h=t(9592),u=t(8612),x=t(3248),v=t(2496);function f(e){let{order:i,orderBy:t,headLabel:n,onRequestSort:s}=e;return(0,v.jsx)(u.c,{children:(0,v.jsx)(l.c,{children:n.map((e=>{return(0,v.jsx)(o.c,{align:e.align||"left",sortDirection:t===e.id&&i,sx:{width:e.width,minWidth:e.minWidth},children:(0,v.jsxs)(x.c,{hideSortIcon:!0,active:t===e.id,direction:t===e.id?i:"asc",onClick:(n=e.id,e=>{s(e,n)}),children:[e.label,t===e.id?(0,v.jsx)(r.c,{sx:{border:0,margin:-1,padding:0,width:"1px",height:"1px",overflow:"hidden",position:"absolute",whiteSpace:"nowrap",clip:"rect(0 0 0 0)"},children:"desc"===i?"sorted descending":"sorted ascending"}):null]})},e.id);var n}))})})}var j=t(3358),g=t(6768),m=t(5548),p=t(5594),w=t(9572),b=t(2892);function S(e){let{filterName:i,onRefresh:t,onFilterName:n}=e;return(0,v.jsxs)(g.c,{sx:{height:96,display:"flex",justifyContent:"space-between",p:e=>e.spacing(0,1,0,3)},children:[(0,v.jsx)(p.c,{value:i,onChange:n,placeholder:"Search...",startAdornment:(0,v.jsx)(w.c,{position:"start",children:(0,v.jsx)(b.ov,{icon:"eva:search-fill",sx:{color:"text.disabled",width:20,height:20}})})}),(0,v.jsx)(j.c,{title:"Refresh",children:(0,v.jsx)(m.c,{onClick:t,children:(0,v.jsx)(b.ov,{icon:"mdi:refresh"})})})]})}var C=t(8960),k=t(7960),y=t(6931),P=t(3996),E=t(6880),N=t(2560);function R(e){let{officer:i,onEdit:t,onDelete:s,onActivate:r}=e;const[c,a]=(0,n.useState)(null),[d,h]=(0,n.useState)(!1);return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)(l.c,{hover:!0,tabIndex:-1,role:"checkbox",children:[(0,v.jsx)(o.c,{component:"th",scope:"row",children:(0,v.jsxs)(C.c,{direction:"row",alignItems:"center",spacing:2,children:[(0,v.jsx)(k.c,{alt:i.name,src:i.avatar}),(0,v.jsx)(E.c,{variant:"subtitle2",noWrap:!0,children:i.name})]})}),(0,v.jsx)(o.c,{children:i.office}),(0,v.jsx)(o.c,{children:i.position}),(0,v.jsx)(o.c,{children:(0,N.SI)(i.role)}),(0,v.jsx)(o.c,{align:"right",sx:{width:50},children:(0,v.jsx)(b.iM,{color:"active"===i.status?"success":"error",children:(0,N.SI)(i.status)})}),(0,v.jsx)(o.c,{align:"right",sx:{width:30},children:(0,v.jsx)(m.c,{onClick:e=>{a(e.currentTarget)},children:(0,v.jsx)(b.ov,{icon:"eva:more-vertical-fill"})})})]}),(0,v.jsxs)(y.cp,{open:!!c,anchorEl:c,onClose:()=>{a(null)},anchorOrigin:{vertical:"top",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"right"},PaperProps:{sx:{width:200}},children:[(0,v.jsxs)(P.c,{onClick:e=>{r(e,i.uuid,"active"!==i.status),a(null)},children:[(0,v.jsx)(b.ov,{icon:"active"===i.status?"material-symbols:lock":"material-symbols:lock-open",sx:{mr:2}}),"active"===i.status?"Deactivate":"Activate"]}),(0,v.jsxs)(P.c,{onClick:e=>{t(e,i.uuid),a(null)},children:[(0,v.jsx)(b.ov,{icon:"eva:edit-fill",sx:{mr:2}}),"Edit"]}),(0,v.jsxs)(P.c,{onClick:()=>h(!0),sx:{color:"error.main"},children:[(0,v.jsx)(b.ov,{icon:"eva:trash-2-outline",sx:{mr:2}}),"Delete"]})]}),(0,v.jsx)(b._6,{open:d,onClose:()=>h(!1),onDelete:e=>{s(e,i.uuid),a(null),h(!1)}})]})}var D=t(9720),I=t(3540),O=t(8964);function W(e,i,t){return i[t]<e[t]?-1:i[t]>e[t]?1:0}function A(e){let{refresh:i,onEdit:t}=e;const{data:u,error:x,refetch:j}=(0,D.UL)(O.Ej),[g,m]=(0,n.useState)(0),[p,w]=(0,n.useState)("asc"),[C,k]=(0,n.useState)("name"),[y,P]=(0,n.useState)(""),[E,N]=(0,n.useState)(10),[A,F]=(0,n.useState)([]),[q,{error:L}]=(0,I.c)(O.qW),[z,{error:B}]=(0,I.c)(O.GO);(0,n.useEffect)((()=>{u&&F(u.getOfficers.map((e=>{var i,t,n;return{uuid:e.uuid,name:e.firstName+" "+e.lastName,position:(null===(i=e.position)||void 0===i?void 0:i.label)||"",role:(null===(t=e.position)||void 0===t?void 0:t.role)||"",office:(null===(n=e.office)||void 0===n?void 0:n.name)||"",status:e.active?"active":"inactive",avatar:e.avatar}})))}),[u]),(0,n.useEffect)((()=>{j()}),[i,j]);const M=(0,n.useMemo)((()=>function(e,i){const t=e.map(((e,i)=>[e,i]));return t.sort(((e,t)=>{const n=i(e[0],t[0]);return 0!==n?n:e[1]-t[1]})),t.map((e=>e[0]))}(A.filter((e=>e.name.includes(y)||e.office.includes(y)||e.position.includes(y)||0===y.length)),function(e,i){return"desc"===e?(e,t)=>W(e,t,i):(e,t)=>-W(e,t,i)}(p,C)).slice(g*E,g*E+E)),[A,y,p,C,g,E]),G=(e,i)=>t(i),T=async(e,i,t)=>{await z({variables:{uuid:i,active:t}}),await j()},U=async(e,i)=>{await q({variables:{uuid:i}}),await j()};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)(s.c,{children:[(0,v.jsx)(S,{filterName:y,onRefresh:async()=>{await j()},onFilterName:e=>{m(0),P(e.target.value)}}),(0,v.jsx)(r.c,{sx:{overflow:"auto"},children:(0,v.jsx)(d.c,{children:(0,v.jsxs)(c.c,{sx:{minWidth:900},children:[(0,v.jsx)(f,{order:p,orderBy:C,onRequestSort:(e,i)=>{w(C===i&&"asc"===p?"desc":"asc"),k(i)},headLabel:[{id:"name",label:"Name",width:250},{id:"office",label:"Office"},{id:"position",label:"Position"},{id:"role",label:"Role"},{id:"status",label:"Status",align:"right"},{id:"uuid",align:"right",width:20}]}),(0,v.jsxs)(a.c,{children:[M.map((e=>(0,v.jsx)(R,{officer:e,onEdit:G,onDelete:U,onActivate:T},e.uuid))),0===M.length&&(0,v.jsx)(l.c,{sx:{height:80},children:(0,v.jsx)(o.c,{align:"center",colSpan:6,children:"No results found."})})]})]})})}),(0,v.jsx)(h.c,{page:g,component:"div",count:A.length,rowsPerPage:E,onPageChange:(e,i)=>{m(i)},rowsPerPageOptions:[10,25,50],onRowsPerPageChange:e=>{m(0),N(parseInt(e.target.value,10))}})]}),(0,v.jsx)(b.wR,{severity:"error",message:(null===x||void 0===x?void 0:x.message)||(null===L||void 0===L?void 0:L.message)||(null===B||void 0===B?void 0:B.message)})]})}}}]);
//# sourceMappingURL=14.5901094c.chunk.js.map