"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[828],{447:(e,s,a)=>{a.r(s),a.d(s,{default:()=>N});var i=a(9060),t=a(7256),n=a(272),l=a(3692),r=a(8960),d=a(9e3),o=a(8320),c=a(6880),u=a(5548),h=a(9344),f=a(3288),m=a(9872),x=a(9572),p=a(4194),g=a(2148),v=a(4924),j=a(4480),b=a(3540),I=a(8964),w=a(2496);const y={firstName:"",lastName:"",positionId:"",officeId:"",password:""};function N(){const e=(0,f.c)(),s=(0,p.KX)(),[a,N]=(0,i.useState)(),[C,W]=(0,i.useState)(!1),[k,S]=(0,i.useState)(y),{firstName:q,lastName:P,positionId:U,officeId:A,password:O}=k,{data:z,error:D}=(0,j.U)(I.mq),{data:F,error:G}=(0,j.U)(I.It),[K,{error:L}]=(0,b.c)(I.uQ),M=e=>{S({...k,[e.target.name]:e.target.value})};return(0,w.jsxs)(t.c,{sx:{...(0,g.mo)({color:(0,m.W4)(e.palette.background.default,.5),imgUrl:"/assets/background/overlay_5.jpg"}),height:1},children:[(0,w.jsx)(v.Ml,{sx:{position:"fixed",top:{xs:16,md:24},left:{xs:16,md:24}}}),(0,w.jsx)(r.c,{alignItems:"center",justifyContent:"center",sx:{height:1},children:(0,w.jsxs)(l.c,{sx:{p:5,width:1,maxWidth:420},children:[(0,w.jsx)(c.c,{variant:"h4",children:"SIGN UP"}),(0,w.jsxs)(c.c,{variant:"body2",sx:{mt:2,mb:5},children:["Already have an account?",(0,w.jsx)(n.c,{href:"/login",variant:"subtitle2",sx:{ml:.5,cursor:"pointer"},children:"Sign in"})]}),(0,w.jsxs)("form",{onSubmit:async e=>{e.preventDefault();const a=await K({variables:{firstName:q,lastName:P,positionId:parseInt(U),officeId:parseInt(A),password:O}});a.data&&a.data.createOfficer?s.push("/login"):N("Account already exists."),S(y)},children:[(0,w.jsxs)(r.c,{spacing:2,sx:{mb:3},children:[(0,w.jsx)(o.c,{name:"firstName",label:"First Name",value:q,onChange:M,required:!0,fullWidth:!0}),(0,w.jsx)(o.c,{name:"lastName",label:"Last Name",value:P,onChange:M,required:!0,fullWidth:!0}),z&&(0,w.jsx)(o.c,{name:"positionId",select:!0,label:"Position",value:U,onChange:M,required:!0,fullWidth:!0,children:z.getPositions.map((e=>(0,w.jsx)(h.c,{value:e.id,children:e.label},e.id)))}),F&&(0,w.jsx)(o.c,{name:"officeId",select:!0,label:"Office",value:A,onChange:M,required:!0,fullWidth:!0,children:F.getOffices.map((e=>(0,w.jsx)(h.c,{value:e.id,children:e.name},e.id)))}),(0,w.jsx)(o.c,{name:"password",label:"Password",type:C?"text":"password",value:O,onChange:M,required:!0,fullWidth:!0,InputProps:{endAdornment:(0,w.jsx)(x.c,{position:"end",children:(0,w.jsx)(u.c,{onClick:()=>W(!C),edge:"end",children:(0,w.jsx)(v.ov,{icon:C?"eva:eye-fill":"eva:eye-off-fill"})})})}})]}),(0,w.jsx)(d.c,{fullWidth:!0,size:"large",type:"submit",variant:"contained",color:"inherit",children:"Sign up"})]})]})}),(0,w.jsx)(v.wR,{severity:"error",message:(null===D||void 0===D?void 0:D.message)||(null===G||void 0===G?void 0:G.message)||(null===L||void 0===L?void 0:L.message)||a})]})}}}]);
//# sourceMappingURL=828.69f45471.chunk.js.map