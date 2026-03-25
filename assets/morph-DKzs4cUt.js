import{i as e}from"./is-DZhPIAbb.js";var t=0,n=void 0;function r(e,t){n===void 0&&(n=document.createElement(`div`),n.style.cssText=`position: absolute; left: 0; top: 0`,document.body.appendChild(n));let r=e.getBoundingClientRect(),i=n.getBoundingClientRect(),{marginLeft:a,marginRight:o,marginTop:s,marginBottom:c}=window.getComputedStyle(e),l=parseInt(a,10)+parseInt(o,10),u=parseInt(s,10)+parseInt(c,10);return{left:r.left-i.left,top:r.top-i.top,width:r.right-r.left,height:r.bottom-r.top,widthM:r.right-r.left+(t===!0?0:l),heightM:r.bottom-r.top+(t===!0?0:u),marginH:t===!0?l:0,marginV:t===!0?u:0}}function i(e){return{width:e.scrollWidth,height:e.scrollHeight}}var a=[`Top`,`Right`,`Bottom`,`Left`],o=[`borderTopLeftRadius`,`borderTopRightRadius`,`borderBottomRightRadius`,`borderBottomLeftRadius`],s=/-block|-inline|block-|inline-/,c=/(-block|-inline|block-|inline-).*:/;function l(e,t){let n=window.getComputedStyle(e),r={};for(let e=0;e<t.length;e++){let i=t[e];if(n[i]===``)if(i===`cssText`){let e=n.length,t=``;for(let r=0;r<e;r++)s.test(n[r])!==!0&&(t+=n[r]+`: `+n[n[r]]+`; `);r[i]=t}else if([`borderWidth`,`borderStyle`,`borderColor`].indexOf(i)!==-1){let e=i.replace(`border`,``),t=``;for(let r=0;r<a.length;r++){let i=`border`+a[r]+e;t+=n[i]+` `}r[i]=t}else if(i===`borderRadius`){let e=``,t=``;for(let r=0;r<o.length;r++){let i=n[o[r]].split(` `);e+=i[0]+` `,t+=(i[1]===void 0?i[0]:i[1])+` `}r[i]=e+`/ `+t}else r[i]=n[i];else i===`cssText`?r[i]=n[i].split(`;`).filter(e=>c.test(e)!==!0).join(`;`):r[i]=n[i]}return r}var u=[`absolute`,`fixed`,`relative`,`sticky`];function d(e){let t=e,n=0;for(;t!==null&&t!==document;){let{position:r,zIndex:i}=window.getComputedStyle(t),a=Number(i);a>n&&(t===e||u.includes(r)===!0)&&(n=a),t=t.parentNode}return n}function f(e){return{from:e.from,to:e.to===void 0?e.from:e.to}}function ee(e){return typeof e==`number`?e={duration:e}:typeof e==`function`&&(e={onEnd:e}),{...e,waitFor:e.waitFor===void 0?0:e.waitFor,duration:isNaN(e.duration)===!0?300:parseInt(e.duration,10),easing:typeof e.easing==`string`&&e.easing.length!==0?e.easing:`ease-in-out`,delay:isNaN(e.delay)===!0?0:parseInt(e.delay,10),fill:typeof e.fill==`string`&&e.fill.length!==0?e.fill:`none`,resize:e.resize===!0,useCSS:e.useCSS===!0||e.usecss===!0,hideFromClone:e.hideFromClone===!0||e.hidefromclone===!0,keepToClone:e.keepToClone===!0||e.keeptoclone===!0,tween:e.tween===!0,tweenFromOpacity:isNaN(e.tweenFromOpacity)===!0?.6:parseFloat(e.tweenFromOpacity),tweenToOpacity:isNaN(e.tweenToOpacity)===!0?.5:parseFloat(e.tweenToOpacity)}}function p(e){let t=typeof e;return t===`function`?e():t===`string`?document.querySelector(e):e}function m(e){return e&&e.ownerDocument===document&&e.parentNode!==null}function h(n){let a=()=>!1,o=!1,s=!0,c=f(n),u=ee(n),h=p(c.from);if(m(h)!==!0)return a;typeof h.qMorphCancel==`function`&&h.qMorphCancel();let g,_,v,y,b=h.parentNode,te=h.nextElementSibling,x=r(h,u.resize),{width:ne,height:re}=i(b),{borderWidth:S,borderStyle:C,borderColor:w,borderRadius:T,backgroundColor:E,transform:ie,position:ae,cssText:oe}=l(h,[`borderWidth`,`borderStyle`,`borderColor`,`borderRadius`,`backgroundColor`,`transform`,`position`,`cssText`]),se=h.classList.toString(),ce=h.style.cssText,D=h.cloneNode(!0),O=u.tween===!0?h.cloneNode(!0):void 0;return O!==void 0&&(O.className=O.classList.toString().split(` `).filter(e=>/^bg-/.test(e)===!1).join(` `)),u.hideFromClone===!0&&D.classList.add(`q-morph--internal`),D.setAttribute(`aria-hidden`,`true`),D.style.transition=`none`,D.style.animation=`none`,D.style.pointerEvents=`none`,b.insertBefore(D,te),h.qMorphCancel=()=>{o=!0,D.remove(),O?.remove(),u.hideFromClone===!0&&D.classList.remove(`q-morph--internal`),h.qMorphCancel=void 0},typeof n.onToggle==`function`&&n.onToggle(),requestAnimationFrame(()=>{let n=p(c.to);if(o===!0||m(n)!==!0){typeof h.qMorphCancel==`function`&&h.qMorphCancel();return}h!==n&&typeof n.qMorphCancel==`function`&&n.qMorphCancel(),u.keepToClone!==!0&&n.classList.add(`q-morph--internal`),D.classList.add(`q-morph--internal`);let{width:f,height:ee}=i(b),{width:te,height:le}=i(n.parentNode);u.hideFromClone!==!0&&D.classList.remove(`q-morph--internal`),n.qMorphCancel=()=>{o=!0,D.remove(),O?.remove(),u.hideFromClone===!0&&D.classList.remove(`q-morph--internal`),u.keepToClone!==!0&&n.classList.remove(`q-morph--internal`),h.qMorphCancel=void 0,n.qMorphCancel=void 0};let k=()=>{if(o===!0){typeof n.qMorphCancel==`function`&&n.qMorphCancel();return}u.hideFromClone!==!0&&(D.classList.add(`q-morph--internal`),D.innerHTML=``,D.style.left=0,D.style.right=`unset`,D.style.top=0,D.style.bottom=`unset`,D.style.transform=`none`),u.keepToClone!==!0&&n.classList.remove(`q-morph--internal`);let c=n.parentNode,{width:p,height:m}=i(c),k=n.cloneNode(u.keepToClone);k.setAttribute(`aria-hidden`,`true`),u.keepToClone!==!0&&(k.style.left=0,k.style.right=`unset`,k.style.top=0,k.style.bottom=`unset`,k.style.transform=`none`,k.style.pointerEvents=`none`),k.classList.add(`q-morph--internal`);let ue=n===h&&b===c?D:n.nextElementSibling;c.insertBefore(k,ue);let{borderWidth:A,borderStyle:j,borderColor:M,borderRadius:N,backgroundColor:P,transform:de,position:fe,cssText:pe}=l(n,[`borderWidth`,`borderStyle`,`borderColor`,`borderRadius`,`backgroundColor`,`transform`,`position`,`cssText`]),me=n.classList.toString(),he=n.style.cssText;n.style.cssText=pe,n.style.transform=`none`,n.style.animation=`none`,n.style.transition=`none`,n.className=me.split(` `).filter(e=>/^bg-/.test(e)===!1).join(` `);let F=r(n,u.resize),I=x.left-F.left,L=x.top-F.top,R=x.width/(F.width>0?F.width:10),z=x.height/(F.height>0?F.height:100),B=ne-f,V=re-ee,H=p-te,U=m-le,W=Math.max(x.widthM,B),G=Math.max(x.heightM,V),K=Math.max(F.widthM,H),q=Math.max(F.heightM,U),J=h===n&&[`absolute`,`fixed`].includes(fe)===!1&&[`absolute`,`fixed`].includes(ae)===!1,Y=fe===`fixed`,X=c;for(;Y!==!0&&X!==document;)Y=window.getComputedStyle(X).position===`fixed`,X=X.parentNode;if(u.hideFromClone!==!0&&(D.style.display=`block`,D.style.flex=`0 0 auto`,D.style.opacity=0,D.style.minWidth=`unset`,D.style.maxWidth=`unset`,D.style.minHeight=`unset`,D.style.maxHeight=`unset`,D.classList.remove(`q-morph--internal`)),u.keepToClone!==!0&&(k.style.display=`block`,k.style.flex=`0 0 auto`,k.style.opacity=0,k.style.minWidth=`unset`,k.style.maxWidth=`unset`,k.style.minHeight=`unset`,k.style.maxHeight=`unset`),k.classList.remove(`q-morph--internal`),typeof u.classes==`string`&&(n.className+=` `+u.classes),typeof u.style==`string`)n.style.cssText+=` `+u.style;else if(e(u.style)===!0)for(let e in u.style)n.style[e]=u.style[e];let Z=d(D),Q=d(n),$=Y===!0?document.documentElement:{scrollLeft:0,scrollTop:0};n.style.position=Y===!0?`fixed`:`absolute`,n.style.left=`${F.left-$.scrollLeft}px`,n.style.right=`unset`,n.style.top=`${F.top-$.scrollTop}px`,n.style.margin=0,u.resize===!0&&(n.style.minWidth=`unset`,n.style.maxWidth=`unset`,n.style.minHeight=`unset`,n.style.maxHeight=`unset`,n.style.overflow=`hidden`,n.style.overflowX=`hidden`,n.style.overflowY=`hidden`),document.body.appendChild(n),O!==void 0&&(O.style.cssText=oe,O.style.transform=`none`,O.style.animation=`none`,O.style.transition=`none`,O.style.position=n.style.position,O.style.left=`${x.left-$.scrollLeft}px`,O.style.right=`unset`,O.style.top=`${x.top-$.scrollTop}px`,O.style.margin=0,O.style.pointerEvents=`none`,u.resize===!0&&(O.style.minWidth=`unset`,O.style.maxWidth=`unset`,O.style.minHeight=`unset`,O.style.maxHeight=`unset`,O.style.overflow=`hidden`,O.style.overflowX=`hidden`,O.style.overflowY=`hidden`),document.body.appendChild(O));let ge=e=>{h===n&&s!==!0?(n.style.cssText=ce,n.className=se):(n.style.cssText=he,n.className=me),k.parentNode===c&&c.insertBefore(n,k),D.remove(),k.remove(),O?.remove(),a=()=>!1,h.qMorphCancel=void 0,n.qMorphCancel=void 0,typeof u.onEnd==`function`&&u.onEnd(s===!0?`to`:`from`,e===!0)};if(u.useCSS!==!0&&typeof n.animate==`function`){let e=u.resize===!0?{transform:`translate(${I}px, ${L}px)`,width:`${W}px`,height:`${G}px`}:{transform:`translate(${I}px, ${L}px) scale(${R}, ${z})`},t=u.resize===!0?{width:`${K}px`,height:`${q}px`}:{},r=u.resize===!0?{width:`${W}px`,height:`${G}px`}:{},i=u.resize===!0?{transform:`translate(${-1*I}px, ${-1*L}px)`,width:`${K}px`,height:`${q}px`}:{transform:`translate(${-1*I}px, ${-1*L}px) scale(${1/R}, ${1/z})`},c=O===void 0?{backgroundColor:E}:{opacity:u.tweenToOpacity},l=O===void 0?{backgroundColor:P}:{opacity:1};y=n.animate([{margin:0,borderWidth:S,borderStyle:C,borderColor:w,borderRadius:T,zIndex:Z,transformOrigin:`0 0`,...e,...c},{margin:0,borderWidth:A,borderStyle:j,borderColor:M,borderRadius:N,zIndex:Q,transformOrigin:`0 0`,transform:de,...t,...l}],{duration:u.duration,easing:u.easing,fill:u.fill,delay:u.delay}),_=O===void 0?void 0:O.animate([{opacity:u.tweenFromOpacity,margin:0,borderWidth:S,borderStyle:C,borderColor:w,borderRadius:T,zIndex:Z,transformOrigin:`0 0`,transform:ie,...r},{opacity:0,margin:0,borderWidth:A,borderStyle:j,borderColor:M,borderRadius:N,zIndex:Q,transformOrigin:`0 0`,...i}],{duration:u.duration,easing:u.easing,fill:u.fill,delay:u.delay}),g=u.hideFromClone===!0||J===!0?void 0:D.animate([{margin:`${V<0?V/2:0}px ${B<0?B/2:0}px`,width:`${W+x.marginH}px`,height:`${G+x.marginV}px`},{margin:0,width:0,height:0}],{duration:u.duration,easing:u.easing,fill:u.fill,delay:u.delay}),v=u.keepToClone===!0?void 0:k.animate([J===!0?{margin:`${V<0?V/2:0}px ${B<0?B/2:0}px`,width:`${W+x.marginH}px`,height:`${G+x.marginV}px`}:{margin:0,width:0,height:0},{margin:`${U<0?U/2:0}px ${H<0?H/2:0}px`,width:`${K+F.marginH}px`,height:`${q+F.marginV}px`}],{duration:u.duration,easing:u.easing,fill:u.fill,delay:u.delay});let d=e=>{g?.cancel(),_?.cancel(),v?.cancel(),y.cancel(),y.removeEventListener(`finish`,d),y.removeEventListener(`cancel`,d),ge(e),g=void 0,_=void 0,v=void 0,y=void 0};h.qMorphCancel=()=>{h.qMorphCancel=void 0,o=!0,d()},n.qMorphCancel=()=>{n.qMorphCancel=void 0,o=!0,d()},y.addEventListener(`finish`,d),y.addEventListener(`cancel`,d),a=e=>o===!0||y===void 0?!1:e===!0?(d(!0),!0):(s=s!==!0,g?.reverse(),_?.reverse(),v?.reverse(),y.reverse(),!0)}else{let e=`q-morph-anim-${++t}`,r=document.createElement(`style`),i=u.resize===!0?`
            transform: translate(${I}px, ${L}px);
            width: ${W}px;
            height: ${G}px;
          `:`transform: translate(${I}px, ${L}px) scale(${R}, ${z});`,c=u.resize===!0?`
            width: ${K}px;
            height: ${q}px;
          `:``,l=u.resize===!0?`
            width: ${W}px;
            height: ${G}px;
          `:``,d=u.resize===!0?`
            transform: translate(${-1*I}px, ${-1*L}px);
            width: ${K}px;
            height: ${q}px;
          `:`transform: translate(${-1*I}px, ${-1*L}px) scale(${1/R}, ${1/z});`,f=O===void 0?`background-color: ${E};`:`opacity: ${u.tweenToOpacity};`,ee=O===void 0?`background-color: ${P};`:`opacity: 1;`,p=O===void 0?``:`
            @keyframes ${e}-from-tween {
              0% {
                opacity: ${u.tweenFromOpacity};
                margin: 0;
                border-width: ${S};
                border-style: ${C};
                border-color: ${w};
                border-radius: ${T};
                z-index: ${Z};
                transform-origin: 0 0;
                transform: ${ie};
                ${l}
              }

              100% {
                opacity: 0;
                margin: 0;
                border-width: ${A};
                border-style: ${j};
                border-color: ${M};
                border-radius: ${N};
                z-index: ${Q};
                transform-origin: 0 0;
                ${d}
              }
            }
          `,m=u.hideFromClone===!0||J===!0?``:`
            @keyframes ${e}-from {
              0% {
                margin: ${V<0?V/2:0}px ${B<0?B/2:0}px;
                width: ${W+x.marginH}px;
                height: ${G+x.marginV}px;
              }

              100% {
                margin: 0;
                width: 0;
                height: 0;
              }
            }
          `,g=J===!0?`
            margin: ${V<0?V/2:0}px ${B<0?B/2:0}px;
            width: ${W+x.marginH}px;
            height: ${G+x.marginV}px;
          `:`
            margin: 0;
            width: 0;
            height: 0;
          `;r.innerHTML=`
          @keyframes ${e} {
            0% {
              margin: 0;
              border-width: ${S};
              border-style: ${C};
              border-color: ${w};
              border-radius: ${T};
              background-color: ${E};
              z-index: ${Z};
              transform-origin: 0 0;
              ${i}
              ${f}
            }

            100% {
              margin: 0;
              border-width: ${A};
              border-style: ${j};
              border-color: ${M};
              border-radius: ${N};
              background-color: ${P};
              z-index: ${Q};
              transform-origin: 0 0;
              transform: ${de};
              ${c}
              ${ee}
            }
          }

          ${m}

          ${p}

          ${u.keepToClone===!0?``:`
            @keyframes ${e}-to {
              0% {
                ${g}
              }

              100% {
                margin: ${U<0?U/2:0}px ${H<0?H/2:0}px;
                width: ${K+F.marginH}px;
                height: ${q+F.marginV}px;
              }
            }
          `}
        `,document.head.appendChild(r);let _=`normal`;D.style.animation=`${u.duration}ms ${u.easing} ${u.delay}ms ${_} ${u.fill} ${e}-from`,O!==void 0&&(O.style.animation=`${u.duration}ms ${u.easing} ${u.delay}ms ${_} ${u.fill} ${e}-from-tween`),k.style.animation=`${u.duration}ms ${u.easing} ${u.delay}ms ${_} ${u.fill} ${e}-to`,n.style.animation=`${u.duration}ms ${u.easing} ${u.delay}ms ${_} ${u.fill} ${e}`;let v=t=>{t===Object(t)&&t.animationName!==e||(n.removeEventListener(`animationend`,v),n.removeEventListener(`animationcancel`,v),ge(),r.remove())};h.qMorphCancel=()=>{h.qMorphCancel=void 0,o=!0,v()},n.qMorphCancel=()=>{n.qMorphCancel=void 0,o=!0,v()},n.addEventListener(`animationend`,v),n.addEventListener(`animationcancel`,v),a=e=>o===!0||!n||!D||!k?!1:e===!0?(v(),!0):(s=s!==!0,_=_===`normal`?`reverse`:`normal`,D.style.animationDirection=_,O.style.animationDirection=_,k.style.animationDirection=_,n.style.animationDirection=_,!0)}};u.waitFor>0||u.waitFor===`transitionend`||u.waitFor===Object(u.waitFor)&&typeof u.waitFor.then==`function`?(u.waitFor>0?new Promise(e=>setTimeout(e,u.waitFor)):u.waitFor===`transitionend`?new Promise(e=>{let t=()=>{r!==null&&(clearTimeout(r),r=null),n&&(n.removeEventListener(`transitionend`,t),n.removeEventListener(`transitioncancel`,t)),e()},r=setTimeout(t,400);n.addEventListener(`transitionend`,t),n.addEventListener(`transitioncancel`,t)}):u.waitFor).then(k).catch(()=>{typeof n.qMorphCancel==`function`&&n.qMorphCancel()}):k()}),e=>a(e)}export{h as t};