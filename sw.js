var CACHE='azmoon-sefarat-v1';
var FILES=['./','index.html','app.js','questions.js','manifest.json','qr.png','assets/style.css',
'assets/img/hero.webp','assets/img/speak.webp','assets/img/daily.webp','assets/img/icon-192.png','assets/img/icon-512.png','assets/img/apple-touch-icon.png','assets/img/favicon.png',
'assets/fonts/Vazirmatn-Regular.woff2','assets/fonts/Vazirmatn-Medium.woff2','assets/fonts/Vazirmatn-Bold.woff2',
'assets/fonts/Fredoka-400.ttf','assets/fonts/Fredoka-500.ttf','assets/fonts/Fredoka-600.ttf','assets/fonts/Fredoka-700.ttf','assets/fonts/AlegreyaI-700.ttf'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){
    var net=fetch(e.request).then(function(res){if(res&&res.ok&&new URL(e.request.url).origin===location.origin){var cl=res.clone();caches.open(CACHE).then(function(c){c.put(e.request,cl)})}return res}).catch(function(){return r});
    return r||net;
  }));
});
