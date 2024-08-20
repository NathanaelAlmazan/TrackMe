"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[460],{5460:(e,r,i)=>{i.r(r),i.d(r,{default:()=>x});var t=i(9060),n=i(2656),o=i(6773),a=i(4488),l=i(7667),s=i(7348),d=i(9072),c=i(4380),u=i(3996),f=i(1424),v=i(9720),m=i(9732),h=i(3540),p=i(8964),g=i(4296),I=i(2496);const b={firstName:"",lastName:"",positionId:"",officeId:"",username:"",password:""};function x(e){var r,i;let{open:x,onClose:C,officerId:O}=e;const[N,j]=(0,t.useState)(),[y,w]=(0,t.useState)(b),[M,E]=(0,t.useState)([]),{firstName:Q,lastName:R,positionId:S,officeId:D,username:P,password:W}=y,{data:k,error:q}=(0,v.UL)(p.mq),{data:B,error:J}=(0,v.UL)(p.It),[A,{data:L,error:T}]=(0,m.U)(p.mG,{fetchPolicy:"no-cache"}),[U,{error:z}]=(0,h.c)(p.uQ),[F,{error:Z}]=(0,h.c)(p.Kg),$=e=>{w({...y,[e.target.name]:e.target.value})};(0,t.useEffect)((()=>{if(y.officeId&&null!==k&&void 0!==k&&k.getPositions&&null!==B&&void 0!==B&&B.getOffices){const e=B.getOffices.find((e=>e.id===y.officeId));e&&E(function(e,r){return e.includes("Regional Director")?r.filter((e=>e.role===g.QJ.Director||e.role===g.QJ.Officer)):e.includes("Division")?r.filter((e=>e.role===g.QJ.Chief&&e.label.includes("Chief")||e.role===g.QJ.Officer)):e.includes("Revenue District Office")?r.filter((e=>e.role===g.QJ.Chief&&e.label.includes("District Officer")||e.role===g.QJ.Officer)):r.filter((e=>e.role===g.QJ.Officer))}(e.name,k.getPositions.map((e=>({id:e.id,label:e.label,role:e.role})))))}}),[y.officeId,B,k]),(0,t.useEffect)((()=>{O&&A({variables:{uuid:O}}).then((e=>{let{data:r}=e;var i,t;r&&r.getOfficerById&&w({firstName:r.getOfficerById.firstName,lastName:r.getOfficerById.lastName,positionId:(null===(i=r.getOfficerById.position)||void 0===i?void 0:i.id.toString())||"",officeId:(null===(t=r.getOfficerById.office)||void 0===t?void 0:t.id.toString())||"",username:"",password:""})}))}),[O,A]);const G=()=>{w(b),C()};return(0,I.jsxs)(I.Fragment,{children:[(0,I.jsxs)(n.c,{open:x,onClose:G,maxWidth:"sm",fullWidth:!0,children:[(0,I.jsx)(o.c,{children:L?`Edit ${(null===(r=L.getOfficerById)||void 0===r?void 0:r.firstName)+" "+(null===(i=L.getOfficerById)||void 0===i?void 0:i.lastName)} Profile`:"Create Officer"}),(0,I.jsxs)("form",{onSubmit:async e=>{if(e.preventDefault(),O){const e=await F({variables:{uuid:O,firstName:Q.trim(),lastName:R.trim(),positionId:parseInt(S),officeId:parseInt(D)}});e.data&&e.data.updateOfficer?C():j("Failed to update account.")}else{let e=null,r=null;if(P.includes("@")){if(!/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(P))return void j("Invalid email address.");e=P}else{const e=P.indexOf("9");if(e<0)return void j("Invalid phone number.");const i=P.substring(e,P.length);if(10!==i.length||!/^\d+$/.test(P))return void j("Invalid phone number.");r=i}if(!e&&!r)return void j("Please provide valid email or phone number.");const i=await U({variables:{firstName:Q.trim(),lastName:R.trim(),positionId:parseInt(S),officeId:parseInt(D),email:e,phone:r,password:W}});i.data&&i.data.createOfficer?C():j("Account already exists.")}w(b)},children:[(0,I.jsx)(a.c,{children:(0,I.jsxs)(d.c,{spacing:2,sx:{mb:3},children:[(0,I.jsx)(c.c,{name:"firstName",label:"First Name",value:Q,onChange:$,required:!0,fullWidth:!0}),(0,I.jsx)(c.c,{name:"lastName",label:"Last Name",value:R,onChange:$,required:!0,fullWidth:!0}),B&&(0,I.jsx)(c.c,{name:"officeId",select:!0,label:"Office",value:D,onChange:$,required:!0,fullWidth:!0,children:B.getOffices.map((e=>(0,I.jsx)(u.c,{value:e.id,children:e.name},e.id)))}),k&&(0,I.jsx)(c.c,{name:"positionId",select:!0,label:"Position",value:S,onChange:$,required:!0,fullWidth:!0,children:M.map((e=>(0,I.jsx)(u.c,{value:e.id,children:e.label},e.id)))}),!L&&(0,I.jsx)(c.c,{name:"username",label:"Email or Phone Number (+63)",value:P,onChange:$,required:!0,fullWidth:!0}),!L&&(0,I.jsx)(c.c,{name:"password",label:"Temporary Password",value:W,onChange:$,required:!0,fullWidth:!0})]})}),(0,I.jsxs)(l.c,{children:[(0,I.jsx)(s.c,{onClick:G,color:"inherit",children:"Cancel"}),(0,I.jsx)(s.c,{type:"submit",variant:"contained",color:"inherit",children:"Save"})]})]})]}),(0,I.jsx)(f.wR,{severity:"error",message:(null===q||void 0===q?void 0:q.message)||(null===J||void 0===J?void 0:J.message)||(null===T||void 0===T?void 0:T.message)||(null===z||void 0===z?void 0:z.message)||N||(null===Z||void 0===Z?void 0:Z.message)})]})}},6773:(e,r,i)=>{i.d(r,{c:()=>p});var t=i(5072),n=i(5656),o=i(9060),a=i(9736),l=i(7067),s=i(6880),d=i(2556),c=i(2128),u=i(2172),f=i(6432),v=i(2496);const m=["className","id"],h=(0,d.cp)(s.c,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(e,r)=>r.root})({padding:"16px 24px",flex:"0 0 auto"}),p=o.forwardRef((function(e,r){const i=(0,c.C)({props:e,name:"MuiDialogTitle"}),{className:s,id:d}=i,p=(0,n.c)(i,m),g=i,I=(e=>{const{classes:r}=e;return(0,l.c)({root:["root"]},u.G,r)})(g),{titleId:b=d}=o.useContext(f.c);return(0,v.jsx)(h,(0,t.c)({component:"h2",className:(0,a.c)(I.root,s),ownerState:g,ref:r,variant:"h6",id:null!=d?d:b},p))}))},3540:(e,r,i)=>{i.d(r,{c:()=>u});var t=i(7328),n=i(9528),o=i(6172),a=i(3520),l=i(9179),s=i(4056),d=i(1579),c=i(4268);function u(e,r){var i=(0,d.y)(null===r||void 0===r?void 0:r.client);(0,l.Y5)(e,l.UT.Mutation);var u=n.useState({called:!1,loading:!1,client:i}),f=u[0],v=u[1],m=n.useRef({result:f,mutationId:0,isMounted:!0,client:i,mutation:e,options:r});(0,c.M)((function(){Object.assign(m.current,{client:i,options:r,mutation:e})}));var h=n.useCallback((function(e){void 0===e&&(e={});var r=m.current,i=r.options,n=r.mutation,l=(0,t.C3)((0,t.C3)({},i),{mutation:n}),d=e.client||m.current.client;m.current.result.loading||l.ignoreResults||!m.current.isMounted||v(m.current.result={loading:!0,error:void 0,data:void 0,called:!0,client:d});var c=++m.current.mutationId,u=(0,o.I)(l,e);return d.mutate(u).then((function(r){var i,t,n=r.data,o=r.errors,l=o&&o.length>0?new s._M({graphQLErrors:o}):void 0,f=e.onError||(null===(i=m.current.options)||void 0===i?void 0:i.onError);if(l&&f&&f(l,u),c===m.current.mutationId&&!u.ignoreResults){var h={called:!0,loading:!1,data:n,error:l,client:d};m.current.isMounted&&!(0,a.y)(m.current.result,h)&&v(m.current.result=h)}var p=e.onCompleted||(null===(t=m.current.options)||void 0===t?void 0:t.onCompleted);return l||null===p||void 0===p||p(r.data,u),r})).catch((function(r){var i;if(c===m.current.mutationId&&m.current.isMounted){var t={loading:!1,error:r,data:void 0,called:!0,client:d};(0,a.y)(m.current.result,t)||v(m.current.result=t)}var n=e.onError||(null===(i=m.current.options)||void 0===i?void 0:i.onError);if(n)return n(r,u),{data:void 0,errors:r};throw r}))}),[]),p=n.useCallback((function(){if(m.current.isMounted){var e={called:!1,loading:!1,client:m.current.client};Object.assign(m.current,{mutationId:0,result:e}),v(e)}}),[]);return n.useEffect((function(){var e=m.current;return e.isMounted=!0,function(){e.isMounted=!1}}),[]),[h,(0,t.C3)({reset:p},f)]}}}]);
//# sourceMappingURL=460.fd185f01.chunk.js.map