// Çevrimdışı: önce ağ, olmazsa önbellek. Böylece güncellemeler hemen gelir, internet yokken de açılır.
var C="hp-web-v1";
self.addEventListener("install",function(e){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;var u=new URL(r.url);if(u.origin!==location.origin)return;
 e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match("./index.html")||caches.match("./")})}))});
// iPhone web push: boş push gelir, metin Worker'dan çekilir
self.addEventListener("push",function(e){e.waitUntil((async function(){var m={title:"Hayat Planım",body:"Hatırlatman var."};try{var c=await caches.open("hp-cfg"),r=await c.match("cfg"),cfg=r?await r.json():null,sub=await self.registration.pushManager.getSubscription();
 if(cfg&&cfg.u&&sub){var x=await fetch(cfg.u+"/msg",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({endpoint:sub.endpoint})});if(x.ok)m=await x.json()}}catch(er){}
 await self.registration.showNotification(m.title,{body:m.body,icon:"icon-192.png"})})())});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(function(l){return l.length?l[0].focus():self.clients.openWindow("./")}))});
