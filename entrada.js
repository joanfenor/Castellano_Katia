/* ============================================================
   Animaciones de la pantalla de bienvenida
   Mientras Katia no pulsa «Empezar», van pasando cosas al azar.
   ============================================================ */
function startEntrada(o){
  const {sp,isGone,lang,faceEl}=o;const U=lang==='uk',L=(es,uk)=>U?uk:es;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const svg=faceEl.querySelector('svg');if(!svg)return;
  const NS='http://www.w3.org/2000/svg';
  const css=`
  .fx{position:absolute;inset:0;pointer-events:none;z-index:3;overflow:hidden}
  .fx>*{position:absolute;left:0;top:0;will-change:transform}
  .fx svg{display:block;overflow:visible}
  .fx-bub{background:#fff;color:#1d2a3a;font:800 15px Figtree,system-ui,sans-serif;padding:8px 13px;border-radius:16px;box-shadow:0 6px 16px rgba(0,30,80,.25);white-space:nowrap;animation:fxPop .35s cubic-bezier(.2,1.6,.4,1) both}
  .fx-bub::after{content:"";position:absolute;left:14px;bottom:-7px;border:8px solid transparent;border-top-color:#fff;border-bottom:0}
  @keyframes fxPop{from{transform:var(--p) scale(.3);opacity:0}}
  .fx-conf{width:8px;height:5px;border-radius:2px}
  .fx-steam path{animation:fxSteam 2.2s ease-in-out infinite}
  .fx-steam path:nth-child(2){animation-delay:.7s}.fx-steam path:nth-child(3){animation-delay:1.4s}
  @keyframes fxSteam{0%{opacity:0;transform:translateY(6px)}40%{opacity:.8}100%{opacity:0;transform:translateY(-14px)}}
  .fx-star{color:#fff;font-size:14px;animation:fxTw 1.8s ease-in-out infinite;text-shadow:0 0 6px #fff}
  @keyframes fxTw{50%{opacity:.25;transform:var(--p) scale(.7)}}
  .fx-wing{transform-box:fill-box;animation:fxFlap .18s ease-in-out infinite alternate}
  .fx-wing.l{transform-origin:100% 50%}.fx-wing.r{transform-origin:0 50%}
  .fx-wing.slow{animation-duration:.6s}
  @keyframes fxFlap{to{transform:scaleX(.25)}}
  .fx-z{font:800 20px 'Young Serif',Georgia,serif;color:#0057b7;text-shadow:0 2px 0 #fff}
.fx-ov .lg.a{animation:fxLeg .22s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 0}.fx-ov .lg.b{animation:fxLeg .22s ease-in-out infinite alternate-reverse;transform-box:fill-box;transform-origin:50% 0}
  @keyframes fxLeg{from{transform:rotate(-25deg)}to{transform:rotate(25deg)}}
.fx-caca .stink path{animation:fxSteam 1.6s ease-in-out infinite}.fx-caca .stink path:nth-child(2){animation-delay:.5s}.fx-caca .stink path:nth-child(3){animation-delay:1s}
  .fx-hand{transform-origin:50% 90%}
  .fx-face .drool,.fx-face .tear{transform-box:fill-box;transform-origin:50% 0;opacity:0}
  .fx-face .drool.go{animation:fxDrool 2.2s ease-in forwards}
  .fx-face .tear.go{animation:fxTear 2.6s ease-in forwards}
  @keyframes fxDrool{0%{opacity:1;transform:scale(.15)}35%{opacity:1;transform:scale(1)}55%{transform:scale(.95,1.25) translateY(1px)}80%{opacity:1;transform:translateY(12px) scale(.9)}100%{opacity:0;transform:translateY(22px) scale(.7)}}
  @keyframes fxTear{0%{opacity:1;transform:scale(.2)}30%{opacity:1;transform:scale(1)}75%{opacity:1;transform:translateY(14px)}100%{opacity:0;transform:translateY(26px)}}
  .medal.shake{animation:fxShake .5s}
  @keyframes fxShake{20%{transform:translateX(-6px) rotate(-3deg)}40%{transform:translateX(6px) rotate(3deg)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  const fx=document.createElement('div');fx.className='fx';sp.appendChild(fx);
  faceEl.classList.add('fx-face');

  /* ---------- utilidades ---------- */
  const add=(html,cls)=>{const d=document.createElement('div');if(cls)d.className=cls;d.innerHTML=html;fx.appendChild(d);return d};
  const put=(e,x,y,extra='')=>{const t=`translate(${x}px,${y}px) ${extra}`;e.style.transform=t;e.style.setProperty('--p',`translate(${x}px,${y}px)`)};
  const tween=(ms,fn)=>new Promise(res=>{const t0=performance.now();const f=now=>{if(isGone())return res();const k=Math.min(1,(now-t0)/ms);fn(k);k<1?requestAnimationFrame(f):res()};requestAnimationFrame(f)});
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const rand=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
  const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  const svgPt=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;const r=p.matrixTransform(svg.getScreenCTM());return {x:r.x,y:r.y}};
  const face=()=>{const r=faceEl.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,top:r.top,bottom:r.bottom,left:r.left,right:r.right}};
  const shake=()=>{try{faceEl.animate([{transform:'none'},{transform:'translateX(-6px) rotate(-4deg)'},{transform:'translateX(6px) rotate(4deg)'},{transform:'translateX(-3px)'},{transform:'none'}],{duration:500})}catch(e){}};
  function bubble(text,ms=1800,dx=0){const f=face();const b=add(`<span>${text}</span>`,'fx-bub');const x=Math.max(8,Math.min(innerWidth-b.offsetWidth-8,f.x+f.w*.18+dx)),y=f.top-6;put(b,x,y);setTimeout(()=>{b.style.transition='opacity .3s';b.style.opacity=0;setTimeout(()=>b.remove(),350)},ms);return b}
  function confetti(x,y,n=26){const C=['#0057b7','#ffd700','#ff7ac6','#8ee25d','#ff8a4c','#fff'];for(let i=0;i<n;i++){const c=add('','fx-conf');c.style.background=pick(C);const a=rand(0,Math.PI*2),v=rand(80,260),vx=Math.cos(a)*v,vy=Math.sin(a)*v-160,r0=rand(0,360);
    tween(1400,k=>{const t=k*1.4;put(c,x+vx*t,y+vy*t+380*t*t,`rotate(${r0+k*720}deg)`);c.style.opacity=1-k}).then(()=>c.remove())}}

  /* ---------- la cara: ojos que miran, boca, baba, lágrima, rubor ---------- */
  const eyes=svg.querySelector('.eyes');let look=null,eL=null,eR=null;
  if(eyes){look=document.createElementNS(NS,'g');eyes.parentNode.insertBefore(look,eyes);look.appendChild(eyes);
    eL=document.createElementNS(NS,'g');eR=document.createElementNS(NS,'g');
    [...eyes.children].forEach(c=>{const cx=+c.getAttribute('cx');(cx<60?eL:eR).appendChild(c)});eyes.appendChild(eL);eyes.appendChild(eR)}
  const mouth=svg.querySelector('path[d^="M49 78"]');
  const g=document.createElementNS(NS,'g');g.innerHTML=`
    <ellipse class="mO" cx="60" cy="82" rx="5" ry="6" fill="#a8323f" stroke="#3b2a22" stroke-width="1.4" display="none"/>
    <g class="mY" display="none"><ellipse cx="60" cy="83" rx="7.5" ry="9.5" fill="#7a1f2b" stroke="#3b2a22" stroke-width="1.5"/><ellipse cx="60" cy="88" rx="4.5" ry="3" fill="#f07a86"/></g>
    <g class="angry" display="none"><path d="M38 46 Q46 48 53 53" fill="none" stroke="#5a3a22" stroke-width="3.6" stroke-linecap="round"/><path d="M82 46 Q74 48 67 53" fill="none" stroke="#5a3a22" stroke-width="3.6" stroke-linecap="round"/><path d="M51 85 Q60 78 69 85" fill="none" stroke="#3b2a22" stroke-width="2.6" stroke-linecap="round"/><g transform="translate(86 34)" stroke="#e0303a" stroke-width="2.2" stroke-linecap="round"><path d="M-5 -2 Q-2 -2 -2 -5 M2 -5 Q2 -2 5 -2 M5 2 Q2 2 2 5 M-2 5 Q-2 2 -5 2"/></g></g>
    <g class="sweat" display="none"><path d="M86 36 Q93 47 89.6 51.6 Q87.4 54 84.6 51.8 Q81.4 47.8 86 36Z" fill="#bfe6ff" stroke="#3f8fd0" stroke-width="1.3"/><ellipse cx="85.4" cy="48.6" rx="1.2" ry="2.4" fill="#fff"/></g>
    <path class="mW" d="M50 83 Q55 79.5 60 83 Q65 86.5 70 83" fill="none" stroke="#3b2a22" stroke-width="2.4" stroke-linecap="round" display="none"/>
    <g class="blush" opacity="0"><ellipse cx="39" cy="73" rx="8" ry="5" fill="#f26b80"/><ellipse cx="81" cy="73" rx="8" ry="5" fill="#f26b80"/></g>
    <g class="drool"><path d="M70.5 79 Q76 87.5 72.6 91.8 Q70.6 93.8 68.4 91.8 Q65.6 87.8 70.5 79Z" fill="#c9ecff" stroke="#4f9fd8" stroke-width="1"/><ellipse cx="69.4" cy="88.6" rx="1" ry="2" fill="#fff"/></g>
    <g class="tear"><path d="M43 68 Q47 74.5 44.6 77.8 Q43 79.4 41.4 77.8 Q39 74.5 43 68Z" fill="#c9ecff" stroke="#4f9fd8" stroke-width="1"/><ellipse cx="42.2" cy="75.6" rx=".8" ry="1.5" fill="#fff"/></g>`;
  svg.appendChild(g);
  const sweatG=g.querySelector('.sweat'),mW=g.querySelector('.mW'),angryG=g.querySelector('.angry'),brows=[...svg.querySelectorAll('path')].filter(p=>/^M3[89] 5|^M6[78] [45]/.test(p.getAttribute('d')||'')&&p.parentNode!==g),mO=g.querySelector('.mO'),mY=g.querySelector('.mY'),blush=g.querySelector('.blush'),drool=g.querySelector('.drool'),tear=g.querySelector('.tear');
  function mouthSet(t){mO.setAttribute('display',t==='O'?'inline':'none');mY.setAttribute('display',t==='Y'?'inline':'none');if(mouth)mouth.setAttribute('display',t?'none':'inline')}
  function angry(on){angryG.setAttribute('display',on?'inline':'none');brows.forEach(b=>b.setAttribute('display',on?'none':'inline'));if(on){if(mouth)mouth.setAttribute('display','none');mO.setAttribute('display','none')}else if(mouth)mouth.setAttribute('display','inline');blush.setAttribute('opacity',on?'.45':'0')}
  function awkward(on){sweatG.setAttribute('display',on?'inline':'none');mW.setAttribute('display',on?'inline':'none');if(mouth)mouth.setAttribute('display',on?'none':'inline');if(on){mO.setAttribute('display','none');try{sweatG.animate([{transform:'translateY(-4px)',opacity:0},{transform:'translateY(0)',opacity:1},{transform:'translateY(3px)',opacity:1}],{duration:900,fill:'forwards'})}catch(e){}}}
  const fire=el=>{el.classList.remove('go');void el.getBoundingClientRect();el.classList.add('go')};
  let tgt=null,lx=0,ly=0,cross=0,wink=0,lid=1;
  function lookAt(x,y){tgt=x==null?null:{x,y}}
  (function eyeLoop(){if(isGone())return;let tx=0,ty=0;if(tgt){const f=face();tx=Math.max(-3.4,Math.min(3.4,(tgt.x-f.x)/(innerWidth/2)*3.4));ty=Math.max(-2.6,Math.min(2,(tgt.y-f.y)/140*2.6))}
    lx+=(tx-lx)*.2;ly+=(ty-ly)*.2;if(look)look.setAttribute('transform',`translate(${lx.toFixed(2)} ${ly.toFixed(2)})`);
    if(eL){eL.setAttribute('transform',`translate(${cross.toFixed(2)} 0) translate(46 62) scale(1 ${lid}) translate(-46 -62)`);eR.setAttribute('transform',`translate(${(-cross).toFixed(2)} 0) translate(74 62) scale(1 ${Math.max(.08,lid*(1-wink*.92))}) translate(-74 -62)`)}
    requestAnimationFrame(eyeLoop)})();

  /* ---------- objetos dibujados ---------- */
  const S={
    choc:`<svg width="70" height="60" viewBox="0 0 64 56"><defs><linearGradient id="fxA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8683c"/><stop offset=".55" stop-color="#6e3a1a"/><stop offset="1" stop-color="#4a230c"/></linearGradient><linearGradient id="fxF" x1="0" x2="1"><stop offset="0" stop-color="#d8dde6"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#9aa3b2"/></linearGradient></defs><path d="M6 30 L40 4 L60 22 L58 40 L22 52 Z" fill="url(#fxF)"/><g transform="rotate(-8 29 26)"><rect x="4" y="6" width="50" height="40" rx="5" fill="url(#fxA)"/><rect x="8" y="10" width="19" height="15" rx="2.5" fill="#8a4a24"/><rect x="31" y="10" width="19" height="15" rx="2.5" fill="#8a4a24"/><rect x="8" y="28" width="19" height="15" rx="2.5" fill="#7a3f1e"/><rect x="31" y="28" width="19" height="15" rx="2.5" fill="#7a3f1e"/><path d="M10 12h15M33 12h15M10 30h15M33 30h15" stroke="rgba(255,255,255,.35)" stroke-width="1.6" stroke-linecap="round"/></g></svg>`,
    ball:`<svg width="44" height="44" viewBox="0 0 40 40"><defs><radialGradient id="fxB" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffb066"/><stop offset=".55" stop-color="#f07a1a"/><stop offset="1" stop-color="#b44a00"/></radialGradient></defs><circle cx="20" cy="20" r="18" fill="url(#fxB)"/><g fill="none" stroke="#4a2200" stroke-width="1.6"><path d="M2 20h36M20 2v36"/><path d="M7 7 Q20 20 7 33"/><path d="M33 7 Q20 20 33 33"/></g><ellipse cx="13" cy="11" rx="5" ry="3" fill="#fff" opacity=".35" transform="rotate(-30 13 11)"/></svg>`,
    hoop:`<svg width="78" height="96" viewBox="0 0 78 96"><rect x="70" y="0" width="6" height="96" rx="2" fill="#8d99a8"/><rect x="34" y="4" width="40" height="32" rx="3" fill="#fff" stroke="#c9d3e0" stroke-width="2"/><rect x="46" y="14" width="16" height="12" fill="none" stroke="#e0303a" stroke-width="2.4"/>
      <g class="net" stroke="#fff" stroke-width="1.4" fill="none" opacity=".95"><path d="M8 40 L14 64 M18 40 L20 64 M28 40 L26 64 M38 40 L32 64 M44 40 L36 62"/><path d="M10 50 Q26 54 42 50 M12 58 Q24 61 38 58"/></g>
      <ellipse cx="26" cy="40" rx="20" ry="5" fill="none" stroke="#f05a00" stroke-width="3.4"/></svg>`,
    candy:c=>`<svg width="46" height="30" viewBox="0 0 46 30"><path d="M12 15 L1 5 Q4 15 1 25 Z" fill="${c[1]}"/><path d="M34 15 L45 5 Q42 15 45 25 Z" fill="${c[1]}"/><ellipse cx="23" cy="15" rx="12" ry="10" fill="${c[0]}"/><path d="M15 9 L19 21 M21 6 L25 24 M27 6 L31 22" stroke="rgba(255,255,255,.6)" stroke-width="2.4"/><ellipse cx="19" cy="10" rx="4" ry="2" fill="#fff" opacity=".7"/></svg>`,
    lolly:`<svg width="34" height="60" viewBox="0 0 34 60"><rect x="15" y="28" width="4" height="32" rx="2" fill="#f3efe6"/><circle cx="17" cy="16" r="15" fill="#ff5fa2"/><path d="M17 16 m0 -11 a11 11 0 1 1 -1 0 m1 4 a7 7 0 1 0 1 0 m-1 4 a3 3 0 1 1 -1 0" fill="none" stroke="#fff" stroke-width="2.4" opacity=".8"/><ellipse cx="11" cy="9" rx="4" ry="2.2" fill="#fff" opacity=".7"/></svg>`,
    plane:`<svg width="84" height="48" viewBox="0 0 84 48"><defs><linearGradient id="fxP1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3eaf4"/></linearGradient><linearGradient id="fxP2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d4e3"/><stop offset="1" stop-color="#9fb0c6"/></linearGradient></defs>
      <path d="M2 24 L80 6 L70 16 Z" fill="#d7e0ec"/>
      <path d="M2 24 L80 6 L46 27 Z" fill="url(#fxP1)" stroke="#a9b8cc" stroke-width="1" stroke-linejoin="round"/>
      <path d="M2 24 L46 27 L38 42 Z" fill="url(#fxP2)" stroke="#8fa1b8" stroke-width="1" stroke-linejoin="round"/>
      <path d="M2 24 L46 27" stroke="#8fa1b8" stroke-width="1"/><path d="M14 22 L62 12" stroke="#fff" stroke-width="1.4" opacity=".8"/></svg>`,

    cart:`<svg width="40" height="30" viewBox="0 0 40 30"><circle cx="13" cy="9" r="5" fill="#f8dccb"/><path d="M8 7 Q13 0 18 7" fill="#ead08e"/><circle cx="27" cy="10" r="4.4" fill="#f3c9a8"/><path d="M23 8 Q27 2 31 8" fill="#5a3a22"/><rect x="2" y="12" width="36" height="12" rx="4" fill="#e0303a"/><rect x="2" y="12" width="36" height="4" rx="2" fill="#ff6b6b"/><circle cx="10" cy="26" r="3.4" fill="#333"/><circle cx="30" cy="26" r="3.4" fill="#333"/></svg>`,
    sunflower:`<svg width="54" height="54" viewBox="0 0 54 54">${Array.from({length:14},(_,i)=>`<ellipse cx="27" cy="9" rx="5" ry="10" fill="${i%2?'#ffd23f':'#f5b400'}" transform="rotate(${i*360/14} 27 27)"/>`).join('')}<circle cx="27" cy="27" r="10" fill="#6b3f1a"/><circle cx="27" cy="27" r="6.5" fill="#4a2a10"/><circle cx="24" cy="24" r="2" fill="#8a5a2b"/></svg>`,
    butterfly:`<svg width="46" height="38" viewBox="0 0 46 38"><g class="fx-wing l"><path d="M22 18 Q6 -6 2 10 Q0 20 22 20Z" fill="#0057b7" stroke="#003d82" stroke-width="1"/><path d="M22 21 Q6 22 6 32 Q10 38 22 23Z" fill="#ffd700" stroke="#c9a400" stroke-width="1"/><circle cx="9" cy="10" r="2" fill="#fff" opacity=".8"/></g><g class="fx-wing r"><path d="M24 18 Q40 -6 44 10 Q46 20 24 20Z" fill="#0057b7" stroke="#003d82" stroke-width="1"/><path d="M24 21 Q40 22 40 32 Q36 38 24 23Z" fill="#ffd700" stroke="#c9a400" stroke-width="1"/><circle cx="37" cy="10" r="2" fill="#fff" opacity=".8"/></g><rect x="21.5" y="10" width="3" height="20" rx="1.5" fill="#2a2326"/><path d="M23 11 Q20 4 17 2 M23 11 Q26 4 29 2" stroke="#2a2326" stroke-width="1" fill="none"/></svg>`,
    bird:`<svg width="58" height="44" viewBox="0 0 58 44"><path d="M8 24 Q4 14 14 14 L40 14 Q52 16 50 26 Q46 36 30 36 Q14 36 8 24Z" fill="#a0703f"/><path d="M14 30 Q30 38 46 28 Q40 36 28 36 Q18 36 14 30Z" fill="#f1e2c8"/><circle cx="44" cy="19" r="9" fill="#a0703f"/><circle cx="47" cy="17" r="2" fill="#111"/><circle cx="47.6" cy="16.4" r=".7" fill="#fff"/><path d="M52 19 L58 21 L52 23Z" fill="#f0a000"/><path d="M8 22 L0 18 L4 26Z" fill="#7a5028"/><g class="fx-wing r" style="transform-origin:50% 100%"><path d="M20 16 Q30 0 40 6 Q34 14 22 18Z" fill="#7a5028"/></g></svg>`,
    mug:`<svg width="56" height="64" viewBox="0 0 56 64"><g class="fx-steam" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"><path d="M16 18 Q12 12 16 6 Q20 0 16 -6"/><path d="M26 18 Q22 12 26 6 Q30 0 26 -6"/><path d="M36 18 Q32 12 36 6 Q40 0 36 -6"/></g><path d="M44 30 Q56 30 54 40 Q52 50 42 48" fill="none" stroke="#e0303a" stroke-width="5"/><path d="M6 22 L46 22 L42 58 Q41 62 36 62 L16 62 Q11 62 10 58Z" fill="#e0303a"/><ellipse cx="26" cy="22" rx="20" ry="5" fill="#5a2e12"/><path d="M14 30 L16 54" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/><text x="26" y="47" font-size="11" text-anchor="middle" fill="#fff" font-family="Figtree,sans-serif" font-weight="800">♥</text></svg>`,
    moon:`<svg width="70" height="70" viewBox="0 0 70 70"><defs><radialGradient id="fxM" cx=".4" cy=".35"><stop offset="0" stop-color="#fffbe6"/><stop offset="1" stop-color="#ffe38a"/></radialGradient></defs><circle cx="35" cy="35" r="30" fill="#fff6c8" opacity=".25"/><path d="M48 12 A26 26 0 1 0 58 50 A20 20 0 1 1 48 12Z" fill="url(#fxM)"/><circle cx="30" cy="40" r="3" fill="#f0d070" opacity=".6"/><circle cx="22" cy="28" r="2" fill="#f0d070" opacity=".6"/></svg>`,
    medalla:`<svg width="54" height="72" viewBox="0 0 54 72"><path d="M14 0 L24 30 L30 30 L22 0Z" fill="#0057b7"/><path d="M40 0 L30 30 L24 30 L32 0Z" fill="#ffd700"/><circle cx="27" cy="46" r="20" fill="#e2a400"/><circle cx="27" cy="46" r="15" fill="#ffd23f" stroke="#c48a00" stroke-width="2"/><path d="M27 36 l3 6.4 7 1-5 4.8 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-4.8 7-1z" fill="#fff6c8"/></svg>`,
    oveja:`<svg width="100" height="82" viewBox="0 0 78 64"><defs><radialGradient id="fxW" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#6d6773"/><stop offset=".55" stop-color="#36313c"/><stop offset="1" stop-color="#16131a"/></radialGradient></defs>
      <g class="legs" fill="#2a2326"><rect class="lg a" x="18" y="40" width="6" height="18" rx="3"/><rect class="lg b" x="28" y="40" width="6" height="18" rx="3"/><rect class="lg a" x="42" y="40" width="6" height="18" rx="3"/><rect class="lg b" x="52" y="40" width="6" height="18" rx="3"/></g>
      <g fill="url(#fxW)"><circle cx="38" cy="28" r="18"/><circle cx="22" cy="26" r="11"/><circle cx="54" cy="26" r="11"/><circle cx="30" cy="16" r="11"/><circle cx="46" cy="15" r="11"/><circle cx="25" cy="37" r="10"/><circle cx="51" cy="37" r="10"/><circle cx="38" cy="40" r="10"/><circle cx="14" cy="30" r="7"/></g>
      <path d="M24 20 q3 -3 6 0 M36 12 q3 -3 6 0 M46 24 q3 -3 6 0 M30 32 q3 -3 6 0" stroke="rgba(255,255,255,.18)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <g transform="translate(62 24)"><ellipse cx="-2" cy="-8" rx="7" ry="3" fill="#2a2326" transform="rotate(-25)"/><ellipse cx="4" cy="2" rx="10" ry="8" fill="#1d181b" transform="rotate(20)"/><circle cx="-1" cy="-6" r="6" fill="#3a3540"/><circle cx="6" cy="0" r="2.3" fill="#fff"/><circle cx="6.6" cy="0.4" r="1.3" fill="#111"/><ellipse cx="12" cy="6" rx="2" ry="1.2" fill="#ff9bb0" opacity=".6"/></g></svg>`,
    caca:`<svg width="70" height="66" viewBox="0 0 70 66"><defs><linearGradient id="fxK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a86b3c"/><stop offset="1" stop-color="#6b3d1c"/></linearGradient></defs>
      <g class="stink" fill="none" stroke="#8bc34a" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M18 10 q-4 -5 0 -10"/><path d="M35 6 q-4 -5 0 -10"/><path d="M52 10 q-4 -5 0 -10"/></g>
      <ellipse cx="35" cy="56" rx="30" ry="10" fill="url(#fxK)"/><ellipse cx="35" cy="42" rx="23" ry="9" fill="url(#fxK)"/><ellipse cx="35" cy="30" rx="15" ry="7.5" fill="url(#fxK)"/><path d="M35 23 Q46 20 40 11 Q38 18 31 19 Q28 23 35 23Z" fill="#7a4524"/>
      <path d="M14 52 Q35 58 56 52 M18 39 Q35 44 52 39 M24 28 Q35 32 46 28" stroke="rgba(255,255,255,.25)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="27" cy="45" rx="5" ry="6" fill="#fff"/><ellipse cx="43" cy="45" rx="5" ry="6" fill="#fff"/><circle cx="28" cy="46" r="3" fill="#2a1a10"/><circle cx="44" cy="46" r="3" fill="#2a1a10"/><circle cx="29" cy="44.8" r="1" fill="#fff"/><circle cx="45" cy="44.8" r="1" fill="#fff"/>
      <ellipse cx="20" cy="53" rx="4" ry="2.4" fill="#ff8aa0" opacity=".7"/><ellipse cx="50" cy="53" rx="4" ry="2.4" fill="#ff8aa0" opacity=".7"/><path d="M29 54 Q35 60 41 54" fill="#5a1f1f" stroke="#2a1a10" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    hand:`<svg width="42" height="50" viewBox="0 0 42 50"><path d="M12 48 Q6 36 6 26 L6 14 Q6 10 10 10 Q13 10 13 14 L13 22 L14 6 Q14 2 18 2 Q22 2 22 6 L22 22 L23 4 Q23 0 27 0 Q31 0 31 4 L30 22 L32 10 Q32 6 36 6 Q40 7 39 11 L36 30 Q34 44 26 48Z" fill="#f8dccb" stroke="#8a6248" stroke-width="1.4"/></svg>`};

  /* ---------- animaciones ---------- */
  const A={};
  /* 1. trozo de chocolate: lo sigue con la mirada y se le cae la baba */
  A.choc=async()=>{const e=add(S.choc),f=face(),dir=pick([1,-1]),W=innerWidth;let drooled=false;
    await tween(5400,k=>{const x=dir>0?-80+k*(W+160):W+80-k*(W+160),y=f.y-f.w*.62+Math.sin(k*Math.PI*3)*12;put(e,x-35,y-30,`rotate(${Math.sin(k*9)*14}deg)`);lookAt(x,y);
      if(!drooled&&Math.abs(x-f.x)<50){drooled=true;fire(drool)}});e.remove();lookAt(null)};
  /* 2. pelota de baloncesto que acaba en canasta */
  A.basket=async()=>{const f=face(),W=innerWidth,dir=pick([1,-1]);const hp=add(S.hoop);const hx=dir>0?W-100:14,hy=innerHeight*.40;hp.style.opacity=0;hp.style.transformOrigin='0 0';put(hp,hx,hy,(dir<0?'translateX(78px) scaleX(-1) ':'')+'scale(1.15)');
    hp.style.transition='opacity .4s';requestAnimationFrame(()=>hp.style.opacity=1);
    const b=add(S.ball);const x0=dir>0?-50:W+50,floor=innerHeight*.62,rimX=dir>0?hx+30:hx+62,rimY=hy+46;let x=x0,y=floor;
    for(let i=0;i<3;i++){const xs=x,xe=x+dir*(W*.17),h=110-i*20;await tween(560,k=>{x=xs+(xe-xs)*k;y=floor-Math.sin(k*Math.PI)*h;put(b,x-22,y-22,`rotate(${k*360*dir}deg)`);lookAt(x,y)})}
    const xs=x,ys=y;await tween(950,k=>{x=xs+(rimX-xs)*k;y=ys+(rimY-6-ys)*k-Math.sin(k*Math.PI)*170;put(b,x-22,y-22,`rotate(${k*540*dir}deg)`);lookAt(x,y)});
    await tween(420,k=>{y=rimY-6+k*60;put(b,rimX-22,y-22);b.style.opacity=k<.7?1:1-(k-.7)/.3});
    const net=hp.querySelector('.net');net&&net.animate&&net.animate([{transform:'scaleY(1)'},{transform:'scaleY(1.25)'},{transform:'scaleY(1)'}],{duration:400});
    confetti(rimX,rimY+20,30);mouthSet('O');bubble(L('¡Canasta, Tomas! 🏀','Кошик, Томасе! 🏀'),1900,dir>0?-f.w*.95:0);await wait(900);mouthSet(null);lookAt(null);
    b.remove();await wait(900);hp.style.opacity=0;await wait(450);hp.remove()};
  /* 3. lluvia de chuches: abre la boca, ñam y se pone colorada */
  A.chuches=async()=>{const f=face(),C=[['#ff5fa2','#c21869'],['#4fc3ff','#1272c4'],['#8ee25d','#2f9a24'],['#ffd23f','#d68a00']];const m=svgPt(60,82);
    const items=[0,1,2,3].map(i=>({e:add(i===3?S.lolly:S.candy(C[i])),x:i===1?m.x:rand(30,innerWidth-30),d:i*600,eat:i===1,r:rand(-1,1)}));mouthSet('O');let ate=false;
    await tween(4800,k=>{const T=k*4800;for(const it of items){const t=Math.max(0,T-it.d)/1000;let y=-50+t*t*140;if(it.eat&&y>m.y-12){y=m.y-12;if(!ate){ate=true;it.e.style.transition='transform .25s,opacity .25s';it.e.style.opacity=0;mouthSet(null);blush.setAttribute('opacity','.55');bubble(L('¡Ñam! 😋','Ням! 😋'),1500)}}
      if(!(it.eat&&ate))put(it.e,it.x-20,y-15,`rotate(${it.r*t*200}deg)`)}
      const nx=items.find(it=>!(it.eat&&ate));if(nx&&!ate)lookAt(m.x,m.y-80+k*60)});
    items.forEach(it=>it.e.remove());await wait(400);blush.setAttribute('opacity','0');lookAt(null)};
  /* 4. la montaña rusa de PortAventura */
  A.coaster=async()=>{const W=innerWidth,H=innerHeight,f=face(),y0=H-34,lx=W*.58;const d=`M-30 ${y0} L${lx-90} ${y0} C${lx-10} ${y0} ${lx+40} ${y0-20} ${lx+34} ${y0-48} C${lx+34} ${y0-90} ${lx-34} ${y0-90} ${lx-34} ${y0-48} C${lx-40} ${y0-20} ${lx+10} ${y0} ${lx+90} ${y0} L${W+30} ${y0}`;
    const tr=add(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="${d}" fill="none" stroke="#7a4c22" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c99a62" stroke-width="3" stroke-dasharray="2 9"/></svg>`);tr.style.opacity=0;tr.style.transition='opacity .4s';requestAnimationFrame(()=>tr.style.opacity=1);
    const path=tr.querySelector('path'),len=path.getTotalLength(),cart=add(S.cart);let shout=false;mouthSet('O');
    await tween(4200,k=>{const s=ease(k)*len,p=path.getPointAtLength(s),q=path.getPointAtLength(Math.min(len,s+2));const a=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI;put(cart,p.x-20,p.y-28,`rotate(${a}deg)`);cart.style.transformOrigin='20px 28px';lookAt(p.x,p.y);
      if(!shout&&p.x>lx-60){shout=true;bubble(L('¡Uaaaaa! 🎢','Уааааа! 🎢'),1600);shake()}});
    mouthSet(null);lookAt(null);tr.style.opacity=0;cart.remove();await wait(450);tr.remove()};
  /* 5. avión de papel con una nota de Sonia */
  A.plane=async()=>{const W=innerWidth,f=face(),pl=add(S.plane),note=add(`<div style="background:#fffef6;border:1px solid #e8dfc4;border-radius:4px;padding:5px 9px;font:700 15px/1.1 'Caveat','Segoe Print','Comic Sans MS',cursive;color:#d6336c;box-shadow:0 4px 10px rgba(0,0,0,.2);white-space:nowrap">${L('¡Te quiero, Katia! ♥ Sonia','Я тебе люблю, Катю! ♥ Соня')}</div>`);let said=false;
    const str=add(`<svg width="40" height="20" viewBox="0 0 40 20"><path d="M0 4 Q20 18 40 10" fill="none" stroke="#c9a96e" stroke-width="1.4"/></svg>`);
    await tween(6800,k=>{const x=W+40-k*(W+360),y=f.top-40+Math.sin(k*Math.PI*2)*30,pitch=-Math.cos(k*Math.PI*2)*10;put(pl,x,y,`rotate(${pitch}deg)`);pl.style.transformOrigin='42px 24px';put(str,x+70,y+10);put(note,x+106,y+10+Math.sin(k*Math.PI*6)*4,`rotate(${Math.sin(k*Math.PI*4)*5}deg)`);lookAt(x+30,y);
      if(!said&&x<f.x){said=true;blush.setAttribute('opacity','.5');bubble(L('¡Ay, Sonia! 🥰','Ох, Соню! 🥰'),1700,-f.w*.95)}});
    pl.remove();note.remove();str.remove();await wait(300);blush.setAttribute('opacity','0');lookAt(null)};
  /* 6. girasoles que crecen y se giran hacia ella */
  A.sun=async()=>{const W=innerWidth,H=innerHeight,f=face(),n=5;const fl=Array.from({length:n},(_,i)=>{const x=W*(i+.5)/n,st=add(`<div style="width:6px;height:150px;border-radius:3px;background:linear-gradient(90deg,#2f7d1e,#7cc04a,#2f7d1e);transform-origin:50% 100%"></div>`),hd=add(S.sunflower);return {x,st,hd,h:rand(90,150)}});
    await tween(1600,k=>{const e=1-Math.pow(1-k,3);for(const s of fl){const h=s.h*e;put(s.st,s.x-3,H-150,`scaleY(${h/150})`);const tilt=Math.max(-35,Math.min(35,(f.x-s.x)/W*80))*e;put(s.hd,s.x-27,H-h-40,`rotate(${tilt}deg) scale(${.4+e*.6})`)}});
    bubble(L('¡Mis girasoles! 🌻','Мої соняшники! 🌻'),1600);await wait(1800);
    await tween(900,k=>{for(const s of fl){const h=s.h*(1-k);put(s.st,s.x-3,H-150,`scaleY(${h/150})`);put(s.hd,s.x-27,H-h-40,`scale(${1-k*.6})`);s.hd.style.opacity=1-k}});fl.forEach(s=>{s.st.remove();s.hd.remove()})};
  /* 7. mariposa que se le posa en la nariz: se pone bizca y estornuda */
  A.butterfly=async()=>{const W=innerWidth,b=add(S.butterfly),nose=svgPt(60,70),sx=pick([-50,W+50]),sy=face().top-60;
    await tween(2600,k=>{const x=sx+(nose.x-sx)*ease(k)+Math.sin(k*14)*18*(1-k),y=sy+(nose.y-sy)*ease(k)+Math.cos(k*11)*22*(1-k);put(b,x-23,y-30);lookAt(x,y)});
    b.querySelectorAll('.fx-wing').forEach(w=>w.classList.add('slow'));
    await tween(500,k=>{cross=k*2.2});await wait(900);mouthSet('O');bubble(L('¡A… a… ACHÍS! 🤧','А… а… АПЧХИ! 🤧'),1500);shake();lookAt(null);
    b.querySelectorAll('.fx-wing').forEach(w=>w.classList.remove('slow'));
    await tween(900,k=>{cross=2.2*(1-k);put(b,nose.x-23+k*(sx>0?260:-260)*-1,nose.y-30-k*240,`rotate(${k*40}deg)`)});mouthSet(null);b.remove()};
  /* 8. un pájaro trae una «ñ» y la deja caer sobre el título */
  A.bird=async()=>{const W=innerWidth,h2=document.getElementById('splashHello');const r=h2.getBoundingClientRect();const tx=r.left+r.width*rand(.3,.7),ty=r.top-6;
    const bd=add(S.bird),tile=add(`<div style="width:34px;height:34px;border-radius:8px;background:linear-gradient(180deg,#fff,#ffeeb0);border:2px solid #e2a400;display:grid;place-items:center;font:400 26px 'Young Serif',Georgia,serif;color:#0057b7;box-shadow:0 4px 8px rgba(0,0,0,.2)">ñ</div>`);
    const x0=-70,y0=r.top-150;
    await tween(2000,k=>{const x=x0+(tx-x0)*k,y=y0+Math.sin(k*Math.PI*4)*10;put(bd,x-29,y-22);put(tile,x-17,y+14);lookAt(x,y)});
    let y=y0+30;const xs=tx;let vy=0;bubble(L('¡Una ñ para mí!','Літера ñ для мене!'),1600);
    const fl=tween(1600,k=>{put(bd,xs-29+k*(W+120),y0-k*80-22)});
    let t=0;await tween(1100,k=>{t=k*1.1;let yy=y0+30+400*t*t;if(yy>ty-34){yy=ty-34-Math.abs(Math.sin(t*14))*18*(1-k)}put(tile,xs-17,yy,`rotate(${Math.sin(t*10)*10*(1-k)}deg)`)});
    await fl;bd.remove();confetti(xs,ty-10,14);await wait(800);tile.style.transition='opacity .4s';tile.style.opacity=0;await wait(450);tile.remove();lookAt(null)};

  /* 9. una oveja negra cruza saltando por abajo: Katia se enfada… y se anima */
  A.oveja=async()=>{const W=innerWidth,H=innerHeight,ov=add(S.oveja,'fx-ov'),base=H-62;const dir=pick([1,-1]);let x=dir>0?-80:W+80,face1=dir;
    angry(true);bubble(L('¡Grrr! ¡Una oveja negra! 💢','Гррр! Чорна вівця! 💢'),1900);
    const hop=async(to,n)=>{const from=x;for(let i=0;i<n;i++){const a=from+(to-from)*i/n,b=from+(to-from)*(i+1)/n;await tween(520,k=>{x=a+(b-a)*k;const y=base-Math.sin(k*Math.PI)*58;put(ov,x-50,y-41,face1<0?'scaleX(-1)':'');lookAt(x,y)})}};
    await hop(dir>0?W-60:60,4);face1=-dir;await wait(200);
    const msg=pick([L('¡Tranquila, Katia: mañana será blanca! 💪','Спокійно, Катю: завтра вона стане білою! 💪'),L('¡A por ella! Esta palabra la aprendo hoy 💪','Уперед! Це слово я вивчу сьогодні 💪'),L('Poco a poco, todas serán blancas 🐑✨','Крок за кроком усі стануть білими 🐑✨')]);
    angry(false);bubble(msg,2600,-40);
    await hop(dir>0?-90:W+90,5);ov.remove();lookAt(null)};

  /* 10. una caca simpática da saltitos por abajo: a Katia le cae una gota de sudor */
  A.caca=async()=>{const W=innerWidth,H=innerHeight,k1=add(S.caca,'fx-caca'),base=H-58,dir=pick([1,-1]);let x=dir>0?-60:W+60,said=false;
    const n=9,step=(W+120)/n;
    for(let i=0;i<n;i++){const a=x,b=x+dir*step;await tween(680,k=>{x=a+(b-a)*k;const air=Math.sin(k*Math.PI),y=base-air*46;const sq=k<.12?1-(.12-k)*2.2:k>.88?1-(k-.88)*2.2:1;
        put(k1,x-35,y-33,`scale(${(2-sq).toFixed(3)},${sq.toFixed(3)}) ${dir<0?'scaleX(-1)':''}`);k1.style.transformOrigin='35px 66px';lookAt(x,y);
        if(!said&&(dir>0?x>W*.3:x<W*.7)){said=true;awkward(true);bubble(pick([L('¡Ayyy, Sonia…! 😅','Ой, Соню…! 😅'),L('Ayyy, Sonia… ¡otra vez! 😅','Ой, Соню… знову! 😅'),L('¿Sonia? ¿Has sido tú? 😅','Соню? Це ти? 😅')]),2600,-f2().w*.95)}})}
    k1.remove();awkward(false);lookAt(null)};
  const f2=()=>face();

  /* ---------- reacciones de Katia ---------- */
  let busy=false,lastAct=performance.now();
  async function yawn(){busy=true;mouthSet('Y');await tween(700,k=>{lid=1-k*.6});const zs=[];const f=face();
    for(let i=0;i<3;i++){const z=add(i%2?'Z':'z','fx-z');zs.push(z);tween(2200,k=>{put(z,f.right-10+i*12+k*20,f.top+20-k*70-i*8);z.style.opacity=1-k;z.style.fontSize=(16+i*5)+'px'})}
    await wait(1300);mouthSet(null);await tween(500,k=>{lid=.4+k*.6});await wait(800);zs.forEach(z=>z.remove());busy=false;lastAct=performance.now()}
  async function waveWink(){if(busy)return;busy=true;const f=face(),h=add(S.hand,'fx-hand');let said=false;
    await tween(1600,k=>{const a=Math.sin(k*Math.PI*6)*22;put(h,f.right-24,f.y-10+(1-Math.min(1,k*4))*40,`rotate(${a}deg)`);wink=k<.15?k/.15:k>.75?Math.max(0,1-(k-.75)/.25):1;
      if(!said){said=true;bubble(L('¡Hola! 😉','Привіт! 😉'),1400)}});wink=0;h.remove();busy=false;lastAct=performance.now()}
  faceEl.style.pointerEvents='auto';faceEl.style.cursor='pointer';
  faceEl.addEventListener('click',e=>{e.stopPropagation();waveWink()});

  /* ---------- según la hora y según los días ---------- */
  const hr=new Date().getHours();
  if(hr>=6&&hr<12){const m=add(S.mug);m.style.opacity=0;m.style.transition='opacity .6s';setTimeout(()=>{const f=face();put(m,Math.max(4,f.left-62),f.y-40);m.style.opacity=1},3200)}
  if(hr>=21||hr<6){const mo=add(S.moon);put(mo,innerWidth-90,40);for(let i=0;i<14;i++){const s=add('✦','fx-star');put(s,rand(8,innerWidth-20),rand(10,innerHeight*.35));s.style.animationDelay=rand(0,1.8)+'s';s.style.fontSize=rand(9,18)+'px'}}
  async function dayMood(){let days={};try{days=JSON.parse(localStorage.getItem('katia-days'))||{}}catch(e){}
    const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const y=new Date();y.setDate(y.getDate()-1);
    const goal=(window.KC&&KC.GOAL)||20;
    if((days[key(y)]||0)>=goal){const f=face(),md=add(S.medalla);await tween(700,k=>{put(md,f.right-34,f.bottom-60-(1-k)*120,`rotate(${(1-k)*-40}deg)`)});confetti(f.right-10,f.bottom-30,18);bubble(L('¡Ayer cumpliste la meta! 🏅','Учора ти виконала мету! 🏅'),2200);await wait(2400);return}
    const ks=Object.keys(days).filter(k=>days[k]>0).sort();const today=key(new Date());const lastK=ks.filter(k=>k<today).pop();
    if(lastK&&!days[today]){const diff=Math.round((new Date(today)-new Date(lastK))/864e5);if(diff>=3){fire(tear);bubble(L('¡Te echaba de menos! 🥺','Я за тобою скучала! 🥺'),2400);await wait(2600)}}}

  /* ---------- el director: va turnando las animaciones ---------- */
  const afternoon=hr>=12&&hr<21;
  const bag=[];const deck=()=>{const all=['choc','basket','chuches','coaster','plane','sun','butterfly','bird','oveja','caca'];if(afternoon)all.push('choc');for(let i=all.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[all[i],all[j]]=[all[j],all[i]]}return all};
  async function director(){await wait(4600);if(isGone()||window.__noDirector)return;await dayMood();
    while(!isGone()){if(performance.now()-lastAct>22000&&!busy){await yawn();await wait(1500);continue}
      if(busy){await wait(500);continue}
      if(!bag.length)bag.push(...deck());const n=bag.shift();busy=true;try{await A[n]()}catch(e){console.error(e)}busy=false;mouthSet(null);angry(false);awkward(false);lookAt(null);cross=0;
      await wait(rand(2500,4500))}}
  /* bostezo si pasa mucho rato sin tocar nada (se reinicia al tocar) */
  sp.addEventListener('pointerdown',()=>{lastAct=performance.now()},true);
  window.__entrada=A;window.__entradaR={yawn,waveWink,dayMood};director()}
startEntrada.ver='v37';
