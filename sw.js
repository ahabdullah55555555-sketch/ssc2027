/* Network first: the newest index.html is used whenever the phone is online, so updating the app means replacing index.html only.
   CACHE v6 (was v5): Otto images are embedded inside index.html itself, so no separate image precache is needed. hills.svg is NOT pre-cached: it is not rendered anywhere (Home banner is an inline SVG), so caching it only added install risk. */
const CACHE='agradia-cache-v6',FONTS='agradia-fonts';
const FILES=['./','./index.html','./manifest.json','./icon.svg','./workout.js','./workout.css'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==FONTS).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
function fromNet(req){return fetch(req,{cache:'no-cache'}).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c))}return r})}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  /* Fonts + QR images: keep a copy so they also work offline after the first online visit. QR code has no expiry - the ID is lifetime, only its image was online-only before. */
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='api.qrserver.com'){
    e.respondWith(caches.open(FONTS).then(c=>c.match(req).then(hit=>{
      const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(req,r.clone());return r}).catch(()=>hit);
      return hit||net;
    })));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(new Promise(res=>{
    let done=false;
    const t=setTimeout(()=>{caches.match(req,{ignoreSearch:true}).then(h=>{if(h&&!done){done=true;res(h)}})},4000);
    fromNet(req).then(r=>{if(!done){done=true;clearTimeout(t);res(r)}}).catch(()=>{clearTimeout(t);if(!done){done=true;caches.match(req,{ignoreSearch:true}).then(h=>res(h||(req.mode==='navigate'?caches.match('./index.html'):Response.error())))}})
  }));
});
