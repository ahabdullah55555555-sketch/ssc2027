/* Network first: the newest index.html is used whenever the phone is online, so updating the app means replacing index.html only.
   CACHE v27 (was v26): DiceBear Avataaars files cached for offline avatar. CACHE v23 (was v22): Master Study Streak poster (downloaded A flame, no glow) in shareStreakPng. hills.svg is NOT pre-cached: it is not rendered anywhere (Home banner is an inline SVG), so caching it only added install risk. */
/* CACHE v29: notification icon cached. */
/* CACHE v30: notification tap navigates to deep links (#messages). */
/* CACHE v31: install caches each file on its own, so one failed download on weak Wi-Fi no longer leaves the cache empty. */
/* CACHE v32: 16 locally-bundled font files (Hind Siliguri / Sora / Poppins / Anton / Archivo Black) pre-cached for offline Bangla. */
/* CACHE v34: manifest icons (icon-192/512 + maskable) pre-cached so the installed icon works offline. */
/* CACHE v37: v3.10.0 UX-audit bundle (pill, catch-up, tour, B7-B13, B4, recDlg). */
/* CACHE v38: OFFLINE FIX — Firebase SDKs cached (the v3.5.5 fix, never pushed: without it the module script's imports fail and the app stalls offline); install retries + activate self-heal so a failed download on weak Wi-Fi never leaves the app unopenable offline; network errors fall back to the saved copy instead of an error page; the app can ask for a re-save (CACHE_NOW). */
const CACHE='agradia-cache-v38',FONTS='agradia-fonts',FB='agradia-firebase-v1';
const FB_FILES=['https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js'];
const ESSENTIAL=['./','./index.html','./manifest.json','./workout.js','./workout.css'];
const FILES=['./','./index.html','./manifest.json','./habit-icons.svg','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./notif-icon.svg','./workout.js','./workout.css','./dicebear-core.mjs','./avataaars.json','./qrcode-generator.js','./fonts/hind-siliguri-400-bengali.woff2','./fonts/hind-siliguri-400-latin.woff2','./fonts/hind-siliguri-500-bengali.woff2','./fonts/hind-siliguri-500-latin.woff2','./fonts/hind-siliguri-600-bengali.woff2','./fonts/hind-siliguri-600-latin.woff2','./fonts/hind-siliguri-700-bengali.woff2','./fonts/hind-siliguri-700-latin.woff2','./fonts/sora-600-latin.woff2','./fonts/sora-700-latin.woff2','./fonts/poppins-400-latin.woff2','./fonts/poppins-500-latin.woff2','./fonts/poppins-600-latin.woff2','./fonts/poppins-700-latin.woff2','./fonts/anton-400-latin.woff2','./fonts/archivo-black-400-latin.woff2'];
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
function addTry(c,u){return c.add(u).then(function(){return true}).catch(function(){return false})}
function addRetry(c,u,tries){return addTry(c,u).then(function(ok){if(ok||tries<=1)return ok;return sleep(2000).then(function(){return addRetry(c,u,tries-1)})})}
function cacheAll(){
  var done={ok:0,total:0};
  return caches.open(CACHE).then(function(c){
    return Promise.all(FILES.map(function(u){
      done.total++;
      return addRetry(c,u,ESSENTIAL.indexOf(u)>=0?2:1).then(function(ok){if(ok)done.ok++});
    }));
  }).then(function(){
    return caches.open(FB).then(function(c){
      return Promise.all(FB_FILES.map(function(u){
        done.total++;
        return addRetry(c,u,2).then(function(ok){if(ok)done.ok++});
      }));
    });
  }).then(function(){return done}).catch(function(){return done});
}
function healOne(c,u){
  /* Make sure url u is in cache c: fetch it fresh; if that fails, copy it from any older cache that still has it. */
  return c.match(u,{ignoreSearch:true}).then(function(hit){
    if(hit)return true;
    return fetch(u,{cache:'no-cache'}).then(function(r){
      if(r&&r.ok)return c.put(u,r.clone()).then(function(){return true}).catch(function(){return false});
      return false;
    }).catch(function(){return false});
  }).then(function(ok){
    if(ok)return true;
    return caches.keys().then(function(ks){
      var olds=ks.filter(function(k){return k!==CACHE&&k!==FONTS&&k!==FB});
      var chain=Promise.resolve(false);
      olds.forEach(function(k){
        chain=chain.then(function(done){
          if(done)return true;
          return caches.open(k).then(function(oc){
            return oc.match(u,{ignoreSearch:true}).then(function(hr){
              if(!hr)return false;
              return c.put(u,hr.clone()).then(function(){return true}).catch(function(){return false});
            });
          });
        });
      });
      return chain;
    });
  });
}
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(cacheAll().catch(function(){}))});
self.addEventListener('activate',e=>{e.waitUntil(
  caches.open(CACHE).then(function(c){
    return Promise.all(ESSENTIAL.map(function(u){return healOne(c,u)}));
  }).then(function(){
    return caches.open(FB).then(function(fc){
      return Promise.all(FB_FILES.map(function(u){return healOne(fc,u)}));
    });
  }).then(function(){
    return caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k!==FONTS&&k!==FB}).map(function(k){return caches.delete(k)}))});
  }).then(function(){return self.clients.claim()})
)});
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
  if(e.data&&e.data.type==='CACHE_NOW'){
    e.waitUntil(cacheAll().then(function(r){
      return self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(cs){
        cs.forEach(function(cl){try{cl.postMessage({type:'CACHE_DONE',ok:r.ok,total:r.total})}catch(err){}});
      });
    }).catch(function(){}));
  }
});
function fromNet(req){return fetch(req,{cache:'no-cache'}).then(function(r){if(!r||!r.ok)throw new Error('net '+((r&&r.status)||'none'));var c=r.clone();caches.open(CACHE).then(function(x){x.put(req,c)});return r})}
function navFallback(){return caches.match('./index.html').then(function(h){if(h)return h;return caches.match('./')})}
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
  /* Firebase SDK (www.gstatic.com/firebasejs): cache-first so the app opens offline after one online load. */
  if(u.hostname==='www.gstatic.com'&&u.pathname.indexOf('/firebasejs/')===0){
    e.respondWith(caches.open(FB).then(c=>c.match(req).then(hit=>{
      const net=fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r}).catch(()=>hit);
      return hit||net;
    })));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(new Promise(res=>{
    let done=false;
    const t=setTimeout(()=>{caches.match(req,{ignoreSearch:true}).then(h=>{if(h&&!done){done=true;res(h)}})},4000);
    fromNet(req).then(r=>{if(!done){done=true;clearTimeout(t);res(r)}}).catch(()=>{clearTimeout(t);if(!done){done=true;caches.match(req,{ignoreSearch:true}).then(h=>{if(h){res(h)}else if(req.mode==='navigate'){navFallback().then(function(h2){res(h2||Response.error())})}else{res(Response.error())}})}})
  }));
});

self.addEventListener('push',e=>{var d={};try{d=e.data?e.data.json():{}}catch(err){}var t=d.title||'Agradia',b=d.body||'';e.waitUntil(self.registration.showNotification(t,{body:b,icon:'./notif-icon.svg',data:{url:d.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();var u=(e.notification.data&&e.notification.data.url)||'./';var deep=u.indexOf('#')>=0;e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(var i=0;i<cs.length;i++){if('focus' in cs[i]){if(deep){cs[i].navigate(u);}else{cs[i].focus();}return cs[i];}}if(clients.openWindow)return clients.openWindow(u)}))});
