// Cambia VERSION cada vez que subas archivos nuevos para que el móvil los actualice.
const VERSION='v36';
const CACHE='katia-'+VERSION;
const FILES=['./','index.html','verbos.html','vocabulario.html','gramatica.html','chuches.html','jardin.html','palabras.js','entrada.js','comun.js','config.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!=='katia-fonts').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.host==='fonts.googleapis.com'||url.host==='fonts.gstatic.com'){
    e.respondWith(caches.open('katia-fonts').then(c=>c.match(req).then(hit=>hit||fetch(req).then(r=>{c.put(req,r.clone());return r}).catch(()=>hit))));return;}
  if(url.origin!==location.origin)return;
  // Primero la copia guardada (funciona sin conexión); en segundo plano se descarga la versión nueva.
  e.respondWith(caches.open(CACHE).then(c=>c.match(req,{ignoreSearch:true}).then(hit=>{
    const net=fetch(req,{cache:'no-cache'}).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>hit);
    return hit||net;})));
});
