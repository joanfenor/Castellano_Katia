/* Funciones compartidas por todas las pantallas: objetivo diario, racha de días, logros,
   repaso de hoy, voz, avisos de traducción, copia de seguridad y contenido de la hoja. */
(function(){
const P='katia-';
const get=(k,d)=>{try{const x=localStorage.getItem(P+k);return x===null?d:JSON.parse(x)}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(P+k,JSON.stringify(v))}catch(e){}};
const lang=()=>get('lang','es')==='uk'?'uk':'es';
const L=(es,uk)=>lang()==='uk'?uk:es;
const pad=n=>String(n).padStart(2,'0');
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>dkey(new Date());
const GOAL=20;

/* ---------- aviso flotante ---------- */
const st=document.createElement('style');
st.textContent=`.kc-toast{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:200;
 background:#0b2a66;color:#fff;border:3px solid #ffd700;border-radius:16px;padding:12px 18px;font:600 16px Figtree,system-ui,sans-serif;
 box-shadow:0 12px 30px rgba(0,0,0,.3);max-width:min(92vw,420px);text-align:center;transition:opacity .4s,transform .4s}
.kc-toast.out{opacity:0;transform:translate(-50%,20px)}
.kc-daily{position:fixed;left:0;right:0;top:env(safe-area-inset-top,0px);z-index:30;background:#0b2a66;color:#fff;font:600 15px Figtree,system-ui,sans-serif;
 padding:10px max(16px,env(safe-area-inset-right,0px)) 10px max(16px,env(safe-area-inset-left,0px));display:flex;gap:12px;align-items:center;justify-content:space-between}
.kc-daily .kb{flex:1;height:8px;border-radius:9px;background:rgba(255,255,255,.25);overflow:hidden;max-width:260px}
.kc-daily .kb i{display:block;height:100%;background:#ffd700}
.kc-daily a{color:#ffd700;font-weight:700;text-decoration:none}
.kc-rep{font:600 12.5px Figtree,system-ui,sans-serif;background:none;border:0;color:var(--muted,#667);text-decoration:underline;cursor:pointer;padding:0;justify-self:start}`;
st.textContent+=`
.kc-hdr{display:flex;gap:8px;align-items:center}
.kc-snd{width:44px;height:44px;border-radius:50%;border:0;background:var(--card,#fff);color:var(--tile,#2747a8);box-shadow:0 4px 16px rgba(0,30,80,.18);display:grid;place-items:center;cursor:pointer;flex:none}
.kc-snd svg{width:22px;height:22px}
.kc-snd[aria-pressed="false"]{color:var(--muted,#667)}
.kc-snd:focus-visible{outline:3px solid #ffd700;outline-offset:2px}`;
document.head.appendChild(st);
let toastQ=[],toasting=false;
function toast(html){toastQ.push(html);if(!toasting)nextToast()}
function nextToast(){const h=toastQ.shift();if(!h){toasting=false;return}toasting=true;
  const el=document.createElement('div');el.className='kc-toast';el.innerHTML=h;document.body.appendChild(el);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>{el.remove();nextToast()},450)},2600)}

/* ---------- días, racha y objetivo ---------- */
function days(){return get('days',{})}
function todayCount(){return days()[today()]||0}
function streak(){const d=days();let n=0;const c=new Date();
  if((d[dkey(c)]||0)<GOAL)c.setDate(c.getDate()-1);
  while((d[dkey(c)]||0)>=GOAL){n++;c.setDate(c.getDate()-1)}return n}
function hit(){
  const d=days(),k=today();d[k]=(d[k]||0)+1;set('days',d);
  set('hits',get('hits',0)+1);
  if(d[k]===GOAL)toast(L(`¡Objetivo de hoy conseguido! 🌻 Llevas ${streak()} ${streak()===1?'día':'días'} seguidos.`,`Мету на сьогодні виконано! 🌻 Днів поспіль: ${streak()}.`));
  checkBadges();
}

/* ---------- logros ---------- */
function countBox(key,min){const s=key==='kvoc-st'?(()=>{try{return JSON.parse(localStorage.getItem('kvoc-st'))||{}}catch(e){return {}}})():get(key,{});
  return Object.values(s).filter(v=>v[0]>=min).length}
function tbest(){let a=get('tbest',0),b=0;try{b=JSON.parse(localStorage.getItem('kvoc-tbest'))||0}catch(e){}return Math.max(a,b,get('gtbest',0))}
const BADGES=[
 ['h10','Primeros 10 aciertos','Перші 10 правильних',s=>s.hits>=10],
 ['h100','100 aciertos','100 правильних',s=>s.hits>=100],
 ['h1000','1.000 aciertos','1000 правильних',s=>s.hits>=1000],
 ['d3','3 días seguidos','3 дні поспіль',s=>s.streak>=3],
 ['d7','Una semana seguida','Тиждень поспіль',s=>s.streak>=7],
 ['d30','Un mes seguido','Місяць поспіль',s=>s.streak>=30],
 ['w50','50 palabras dominadas','50 вивчених слів',s=>s.words>=50],
 ['w200','200 palabras dominadas','200 вивчених слів',s=>s.words>=200],
 ['w500','500 palabras dominadas','500 вивчених слів',s=>s.words>=500],
 ['v50','50 formas verbales dominadas','50 вивчених форм дієслів',s=>s.verbs>=50],
 ['v300','300 formas verbales dominadas','300 вивчених форм дієслів',s=>s.verbs>=300],
 ['c10','Racha de 10 aciertos','Серія з 10 правильних',s=>s.best>=10],
 ['c25','Racha de 25 aciertos','Серія з 25 правильних',s=>s.best>=25],
 ['l4','Nivel 4: corona de flores','Рівень 4: віночок',s=>s.pts>=450],
 ['l8','Nivel 8: leyenda','Рівень 8: легенда',s=>s.pts>=1050],
 ['r1','Primer repaso del día','Перше щоденне повторення',s=>s.daily>=1],
 ['r10','10 repasos del día','10 щоденних повторень',s=>s.daily>=10],
 ['t200','200 puntos en contrarreloj','200 балів на час',s=>s.timer>=200],
 ['g5','Las 5 dudas típicas practicadas','Усі 5 типових труднощів',s=>s.dudas>=5],
 ['s5','Las 5 situaciones completadas','Усі 5 ситуацій',s=>s.sits>=5]
];
function stats(){const dst=get('dst',{});
  return {hits:get('hits',0),streak:streak(),words:countBox('kvoc-st',3),verbs:countBox('vst',3),best:get('best',0),pts:get('pts',0),
    daily:get('dailydone',0),timer:tbest(),dudas:Object.values(dst).filter(n=>n>=10).length,sits:get('sits',[]).length}}
function badges(){const s=stats(),have=new Set(get('badges',[]));return BADGES.map(([id,es,uk,f])=>({id,name:L(es,uk),on:have.has(id)||f(s)}))}
function checkBadges(){const s=stats(),have=get('badges',[]);let changed=false;
  for(const [id,es,uk,f] of BADGES)if(!have.includes(id)&&f(s)){have.push(id);changed=true;toast(L('¡Nuevo logro! ','Нове досягнення! ')+'<b>'+L(es,uk)+'</b>')}
  if(changed)set('badges',have)}

/* ---------- repaso de hoy ---------- */
const DN=10;
function daily(){try{return JSON.parse(sessionStorage.getItem('katia-daily'))}catch(e){return null}}
function setDaily(v){try{v?sessionStorage.setItem('katia-daily',JSON.stringify(v)):sessionStorage.removeItem('katia-daily')}catch(e){}}
function dailyStart(){setDaily({phase:'verbos',left:DN});location.href='verbos.html?hoy=1'}
function dailyActive(phase){const d=daily();return !!(d&&d.phase===phase&&/[?&]hoy=1/.test(location.search))}
function dailyBar(phase){
  if(!dailyActive(phase))return;const d=daily();
  let bar=document.querySelector('.kc-daily');
  if(!bar){bar=document.createElement('div');bar.className='kc-daily';document.body.prepend(bar)}
  const total=DN*2,doneN=(phase==='verbos'?0:DN)+(DN-d.left);
  document.documentElement.style.setProperty('--kcd',bar.offsetHeight+'px');
  bar.innerHTML=`<span>${L('Repaso de hoy','Повторення дня')} · ${doneN}/${total}</span><span class="kb"><i style="width:${doneN/total*100}%"></i></span><a href="./">${L('Salir','Вийти')}</a>`;
}
function dailyTick(phase){
  if(!dailyActive(phase))return false;const d=daily();d.left--;
  if(d.left>0){setDaily(d);dailyBar(phase);return false}
  if(phase==='verbos'){setDaily({phase:'vocab',left:DN});setTimeout(()=>location.href='vocabulario.html?hoy=1',1300)}
  else{setDaily(null);set('dailydone',get('dailydone',0)+1);checkBadges();setTimeout(()=>location.href='./?hecho=1',1300);
    const bar=document.querySelector('.kc-daily');if(bar)bar.innerHTML=`<span>${L('¡Repaso de hoy completado! 🌻','Повторення дня виконано! 🌻')}</span>`;return true}
  dailyBar(phase);return true;
}

/* ---------- voz ---------- */
const canSpeak='speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';
let esVoice=null;
function pickVoice(){try{const v=speechSynthesis.getVoices();esVoice=v.find(x=>/^es[-_]ES/i.test(x.lang))||v.find(x=>/^es/i.test(x.lang))||null}catch(e){}}
if(canSpeak){pickVoice();try{speechSynthesis.onvoiceschanged=pickVoice}catch(e){}}
function say(txt,rate){if(!canSpeak)return false;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(txt).replace(/\(.*?\)/g,'').replace(/ \/ /g,', ').replace(/_+/g,''));
  u.lang='es-ES';if(esVoice)u.voice=esVoice;u.rate=rate||.9;speechSynthesis.speak(u);return true}catch(e){return false}}
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function listen(onText,onEnd){
  if(!SR)return false;
  try{const r=new SR();r.lang='es-ES';r.interimResults=false;r.maxAlternatives=5;
    r.onresult=e=>{const alts=[...e.results[0]].map(a=>a.transcript);onText(alts)};
    r.onerror=e=>onEnd&&onEnd(e.error||'error');r.onend=()=>onEnd&&onEnd('end');r.start();return r}catch(e){return false}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-say]');if(b&&!b.closest('[data-own-say]'))say(b.dataset.say)});

/* ---------- avisar de una traducción ---------- */
function report(es,uk){
  const num=(window.KATIA_CONFIG&&KATIA_CONFIG.whatsapp||'').replace(/\D/g,'');
  const txt=`Castellano Katia · traducción para revisar: «${es}» = «${uk}»`;
  const list=get('reports',[]);if(!list.some(x=>x[0]===es)){list.push([es,uk]);set('reports',list)}
  const a=document.createElement('a');a.href=`https://wa.me/${num}?text=${encodeURIComponent(txt)}`;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
  toast(L('Gracias. Se abre WhatsApp para enviar el aviso.','Дякую! Відкривається WhatsApp, щоб надіслати повідомлення.'));
}

/* ---------- copia de seguridad ---------- */
function backup(){const o={app:'castellano-katia',fecha:new Date().toISOString(),datos:{}};
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^(katia-|kvoc-)/.test(k))o.datos[k]=localStorage.getItem(k)}
  return JSON.stringify(o)}
function restore(txt){const o=JSON.parse(txt);if(!o||o.app!=='castellano-katia'||!o.datos)throw new Error('formato');
  for(const [k,v] of Object.entries(o.datos))if(/^(katia-|kvoc-)/.test(k))localStorage.setItem(k,v);return Object.keys(o.datos).length}

/* ---------- contenido extra de la hoja ---------- */
function parseCSV(text){const rows=[];let row=[],f='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;else if(c===','){row.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(f);rows.push(row);row=[];f=''}else f+=c}
  if(f!==''||row.length){row.push(f);rows.push(row)}
  return rows.filter(r=>r.some(x=>x.trim()))}
function extra(){return get('extra',[])}
async function loadExtra(){
  const url=window.KATIA_CONFIG&&KATIA_CONFIG.hojaCSV;if(!url||!navigator.onLine)return false;
  try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)return false;const rows=parseCSV(await r.text());
    const head=rows.shift().map(h=>h.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''));
    const items=rows.map(r=>Object.fromEntries(head.map((h,i)=>[h,(r[i]||'').trim()])));
    set('extra',items);return true}catch(e){return false}}


/* ---------- botón de sonido junto al idioma ---------- */
const ICON_ON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
const ICON_OFF='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>';
function mountSound(){
  if(document.querySelector('.kc-snd'))return;const side=document.querySelector('.hdrbtns');const b=document.createElement('button');b.className='kc-snd';
  if(side){const f=side.querySelector('.kc-flag');side.insertBefore(b,f?f.nextSibling:side.firstChild)}else{const lg=document.querySelector('header .lang');if(!lg)return;const box=document.createElement('div');box.className='kc-hdr';lg.parentNode.insertBefore(box,lg);box.appendChild(b);box.appendChild(lg)}
  const paint=()=>{const on=get('sound',true);b.setAttribute('aria-pressed',on);b.innerHTML=on?ICON_ON:ICON_OFF;b.setAttribute('aria-label',on?L('Sonido activado','Звук увімкнено'):L('Sonido desactivado','Звук вимкнено'))};
  b.onclick=()=>{const on=!get('sound',true);set('sound',on);paint();dispatchEvent(new CustomEvent('kc-sound',{detail:on}))};
  paint();
}
function mountExit(){const b=document.getElementById('exitBtn');if(!b)return;
  b.setAttribute('aria-label',L('Salir','Вийти'));b.title=L('Salir','Вийти');
  b.onclick=()=>{try{window.close()}catch(e){}
    setTimeout(()=>{if(!document.hidden)toast(L('El móvil no deja que la app se cierre sola. Para salir, pulsa «Atrás» o ciérrala desde las apps abiertas. Tu progreso ya está guardado.','Телефон не дозволяє застосунку закритися самому. Щоб вийти, натисни «Назад» або закрий його у списку відкритих застосунків. Твій прогрес уже збережено.'))},400)}}
function mountHdr(){mountFlag();mountSound();mountExit();hdrH();const h=document.querySelector('header');if(h&&window.ResizeObserver)new ResizeObserver(hdrH).observe(h)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountHdr);else mountHdr();
function hdrH(){const h=document.querySelector('header');if(h)document.documentElement.style.setProperty('--hdrh',h.offsetHeight+'px');const b=document.querySelector('.kc-daily');if(b)document.documentElement.style.setProperty('--kcd',b.offsetHeight+'px')}
addEventListener('load',hdrH);addEventListener('resize',hdrH);


function gift(pts){const PER=150,L=Math.floor(pts/PER),left=PER-(pts-L*PER);
  const g=lang()==='uk'?{1:'соняшник у волоссі',3:'віночок',6:'блискучі зірочки'}:{1:'un girasol en el pelo',3:'una corona de flores',6:'estrellas brillantes'};
  const x=g[L+1]||'';if(lang()==='uk'){const n10=left%10,n100=left%100,w=n10===1&&n100!==11?'бал':(n10>=2&&n10<=4&&(n100<12||n100>14)?'бали':'балів');return `Ще ${left} ${w} до рівня ${L+2}${x?': '+x:''}.`}
  return `Faltan ${left} puntos para el nivel ${L+2}${x?': '+x:''}.`}
function paintGift(pts){const el=document.getElementById('nextGift');if(el)el.textContent=gift(pts)}


/* ---------- idioma con bandera ---------- */
const FLAG_ES='<svg viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="30" fill="#c60b1e"/><rect y="7.5" width="30" height="15" fill="#ffc400"/></svg>';
const FLAG_UK='<svg viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="15" fill="#0057b7"/><rect y="15" width="30" height="15" fill="#ffd700"/></svg>';
function mountFlag(){
  const side=document.querySelector('.hdrbtns');if(!side||document.querySelector('.kc-flag'))return;
  const es=document.getElementById('langEs'),uk=document.getElementById('langUk');if(!es||!uk)return;
  const b=document.createElement('button');b.className='kc-flag';side.prepend(b);
  const paint=()=>{const l=lang();b.innerHTML=l==='uk'?FLAG_UK:FLAG_ES;
    b.setAttribute('aria-label',l==='uk'?'Мова: українська. Змінити на іспанську':'Idioma: español. Cambiar a ucraniano');b.title=b.getAttribute('aria-label')};
  b.onclick=()=>{(lang()==='uk'?es:uk).click();setTimeout(paint,0)};
  paint();
}

/* ---------- teclado del móvil: mantener la cabecera visible ---------- */
if(window.visualViewport){const vv=window.visualViewport;
  const fix=()=>{const off=Math.max(0,vv.offsetTop);document.querySelectorAll('header,.kc-daily').forEach(e=>{e.style.transform=off?`translateY(${off}px)`:''})};
  vv.addEventListener('resize',fix);vv.addEventListener('scroll',fix);}
document.addEventListener('focusin',e=>{const el=e.target;if(!el.matches||!el.matches('input:not([type=checkbox]):not([type=file]),textarea'))return;
  setTimeout(()=>{const cs=getComputedStyle(document.documentElement);const top=(parseFloat(cs.getPropertyValue('--hdrh'))||130)+(parseFloat(cs.getPropertyValue('--kcd'))||0)+14;
    const vt=window.visualViewport?visualViewport.offsetTop:0;const r=el.getBoundingClientRect();const y=r.top-vt;
    const vh=window.visualViewport?visualViewport.height:innerHeight;if(y<top||y+r.height>vh-10)window.scrollBy({top:y-top,behavior:'smooth'})},380)});
window.KC={gift,paintGift,get,set,L,lang,today,GOAL,days,todayCount,streak,hit,badges,checkBadges,stats,toast,
  dailyStart,dailyActive,dailyBar,dailyTick,daily,canSpeak,say,canListen:!!SR,listen,report,backup,restore,extra,loadExtra,parseCSV};
loadExtra();
})();
