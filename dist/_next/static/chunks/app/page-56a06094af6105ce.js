(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{3023:function(t,e,n){Promise.resolve().then(n.bind(n,318))},318:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return l}});var r=n(7437);n(6648);var s=n(2265),i=()=>{let[t,e]=(0,s.useState)([]),[n,i]=(0,s.useState)(0),[l,u]=(0,s.useState)(null);(0,s.useEffect)(()=>{fetch("/questions.txt").then(t=>t.text()).then(t=>{e(c(t))}).catch(t=>console.error("Error fetching questions:",t))},[]);let c=t=>{let e=t.trim().split("**[]**"),n=[];for(let t=0;t<e.length;t++){let r=0,s=e[t].trim().split("\n"),i="",l=[],u=[];for(let t=0;t<s.length;t++)""!==s[t].trim()&&(s[t].startsWith("### ")?i=s[t].substring(4).trim():s[t].startsWith("- [")&&(l.push(r+1+".  "+s[t].substring(6).trim()),s[t].startsWith("- [x] ")&&u.push(r),r++));n.push({question:i,answers:l,correctAnswerIndex:u})}return n},o=t=>{u(t)};if(0===t.length)return(0,r.jsx)("div",{children:"Loading questions..."});let{question:a,answers:h,correctAnswerIndex:d}=t[n];return(0,r.jsxs)("div",{class:"space-y-4 ",children:[(0,r.jsxs)("h5",{class:"mb-4 text-xl font-extrabold leading-none tracking-tight",children:[n+1," - ",a]}),h.map((t,e)=>(0,r.jsx)("div",{onClick:()=>o(e),style:{backgroundColor:l===e?d===e?"green":"red":"transparent",cursor:"pointer",padding:"8px",marginBottom:"8px"},children:t},e)),n<t.length-1&&(0,r.jsx)("div",{children:(0,r.jsx)("button",{class:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",onClick:()=>{u(null),i(n+1)},children:"Next"})}),(0,r.jsx)("div",{children:(0,r.jsx)("input",{type:"text",value:n+1,onChange:e=>{let n=parseInt(e.target.value,10);!isNaN(n)&&n-1>0&&n-1<t.length&&i(n-1)}})}),(0,r.jsxs)("p",{children:["correctAnswerIndex: ",d]})]})};function l(){return(0,r.jsx)("main",{className:"flex min-h-screen flex-col items-center justify-between p-24",children:(0,r.jsx)(i,{})})}}},function(t){t.O(0,[648,971,23,744],function(){return t(t.s=3023)}),_N_E=t.O()}]);