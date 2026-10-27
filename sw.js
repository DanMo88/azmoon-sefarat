// آزمون سفارت service worker — works offline after first visit.
// HTML: network-first (cached copy offline) · static assets: stale-while-revalidate · cross-origin: never touched.
var CACHE = 'azmoon-sefarat-v3';
var FILES = ['./', 'index.html', 'app.js?v=3', 'questions.js', 'install.js?v=1', 'manifest.webmanifest', 'manifest.json', 'qr.png', 'assets/style.css?v=3',
  'assets/img/hero.webp', 'assets/img/speak.webp', 'assets/img/daily.webp', 'assets/img/icon-192.png', 'assets/img/icon-512.png',
  'assets/img/maskable-192.png', 'assets/img/maskable-512.png', 'assets/img/apple-touch-icon.png', 'assets/img/favicon.png',
  'assets/fonts/Vazirmatn-Regular.woff2', 'assets/fonts/Vazirmatn-Medium.woff2', 'assets/fonts/Vazirmatn-Bold.woff2',
  'assets/fonts/Fredoka-400.ttf', 'assets/fonts/Fredoka-500.ttf', 'assets/fonts/Fredoka-600.ttf', 'assets/fonts/Fredoka-700.ttf', 'assets/fonts/AlegreyaI-700.ttf'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return Promise.all(FILES.map(function (u) { return c.add(u).catch(function () {}); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x.indexOf('azmoon-sefarat') === 0 && x !== CACHE; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); }));
});
function put(req, res) { if (res && res.ok) { var cl = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, cl); }); } return res; }
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
    e.respondWith(fetch(req).then(function (r) { return put(url.pathname, r); }).catch(function () {
      return caches.match(url.pathname).then(function (r) { return r || caches.match('index.html'); });
    }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (r) { return put(req, r); }).catch(function () { return hit || caches.match(req, { ignoreSearch: true }); });
    return hit || net;
  }));
});
