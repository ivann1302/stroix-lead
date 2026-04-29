var u={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d;function R(){if(d)return n;d=1;var s=Symbol.for("react.transitional.element"),o=Symbol.for("react.fragment");function e(p,r,t){var i=null;if(t!==void 0&&(i=""+t),r.key!==void 0&&(i=""+r.key),"key"in r){t={};for(var a in r)a!=="key"&&(t[a]=r[a])}else t=r;return r=t.ref,{$$typeof:s,type:p,key:i,ref:r!==void 0?r:null,props:t}}return n.Fragment=o,n.jsx=e,n.jsxs=e,n}var x;function c(){return x||(x=1,u.exports=R()),u.exports}var l=c();async function v(s){const o=await fetch("/api/send-lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...s,page:window.location.href,createdAt:new Date().toISOString()})}),e=await o.json().catch(()=>({}));if(!o.ok||!e.ok)throw new Error(e.error||"Не удалось отправить заявку.");return e}export{l as j,v as s};
