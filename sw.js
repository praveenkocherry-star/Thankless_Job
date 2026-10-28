/* Spoken PixelCraft service worker: the app page always comes fresh from the network when online (so updates show at once), with the saved copy used offline */
const CACHE='spc-shell-7';const SHELL=['pixelcraft.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const page=e.request.mode==='navigate'||/\.html$|\.webmanifest$/.test(u.pathname);
  e.respondWith(caches.open(CACHE).then(async c=>{
    if(page){try{const r=await fetch(e.request,{cache:'no-store'});if(r&&r.ok)c.put(e.request,r.clone());return r}catch(err){const hit=await c.match(e.request,{ignoreSearch:true});return hit||new Response('Offline',{status:503})}}
    const hit=await c.match(e.request,{ignoreSearch:true});const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}const r=await net;return r||new Response('Offline',{status:503})}))});
