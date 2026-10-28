/* Spoken PixelCraft is a plain web page now: this removes the old offline helper and its stored copies */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())await caches.delete(k);await self.registration.unregister();for(const c of await self.clients.matchAll({type:'window'}))c.navigate(c.url)})())});
