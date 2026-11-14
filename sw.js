/* Network first: the newest index.html is used whenever the phone is online, so updating the app means replacing index.html only.
   CACHE v27 (was v26): DiceBear Avataaars files cached for offline avatar. CACHE v23 (was v22): Master Study Streak poster (downloaded A flame, no glow) in shareStreakPng. hills.svg is NOT pre-cached: it is not rendered anywhere (Home banner is an inline SVG), so caching it only added install risk. */
/* CACHE v29: notification icon cached. */
/* CACHE v30: notification tap navigates to deep links (#messages). */
/* CACHE v31: install caches each file on its own, so one failed download on weak Wi-Fi no longer leaves the cache empty. */
/* CACHE v32: 16 locally-bundled font files (Hind Siliguri / Sora / Poppins / Anton / Archivo Black) pre-cached for offline Bangla. */
/* CACHE v34: manifest icons (icon-192/512 + maskable) pre-cached so the installed icon works offline. */
/* CACHE v35: v3.9.0 feedback fixes. */const CACHE='agradia-cache-v35',FONTS='agradia-fonts';
const FILES=['./','./index.html','./manifest.json','./habit-icons.svg','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./notif-icon.svg','./workout.js','./workout.css','./dicebear-core.mjs','./avataaars.json','./qrcode-generator.js','./fonts/hind-siliguri-400-bengali.woff2','./fonts/hind-siliguri-400-latin.woff2','./fonts/hind-siliguri-500-bengali.woff2','./fonts/hind-siliguri-500-latin.woff2','./fonts/hind-siliguri-600-bengali.woff2','./fonts/hind-siliguri-600-latin.woff2','./fonts/hind-siliguri-700-bengali.woff2','./fonts/hind-siliguri-700-latin.woff2','./fonts/sora-600-latin.woff2','./fonts/sora-700-latin.woff2','./fonts/poppins-400-latin.woff2','./fonts/poppins-500-latin.woff2','./fonts/poppins-600-latin.woff2','./fonts/poppins-700-latin.woff2','./fonts/anton-400-latin.woff2','./fonts/archivo-black-400-latin.woff2'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(FILES.map(function(u){return c.add(u).catch(function(){})}))}).catch(function(){}))});
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

self.addEventListener('push',e=>{var d={};try{d=e.data?e.data.json():{}}catch(err){}var t=d.title||'Agradia',b=d.body||'';e.waitUntil(self.registration.showNotification(t,{body:b,icon:'./notif-icon.svg',data:{url:d.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();var u=(e.notification.data&&e.notification.data.url)||'./';var deep=u.indexOf('#')>=0;e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(var i=0;i<cs.length;i++){if('focus' in cs[i]){if(deep){cs[i].navigate(u);}else{cs[i].focus();}return cs[i];}}if(clients.openWindow)return clients.openWindow(u)}))});
