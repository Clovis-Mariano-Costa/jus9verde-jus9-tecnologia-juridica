const CACHE_NAME = 'jus9verde-pwa-v2-2026-06-01';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/instalar-app',
  '/instalar-app.html',
  '/manifest.webmanifest',
  '/assets/css/style.css',
  '/assets/css/visual-jus9-fase-final.css',
  '/assets/js/main.js',
  '/assets/img/favicon.png',
  '/assets/img/logo-jus9-verde.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE_ASSETS);
    }).catch(function() {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return key !== CACHE_NAME;
      }).map(function(key) {
        return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var requestUrl = new URL(event.request.url);
  var sameOrigin = requestUrl.origin === self.location.origin;
  var acceptsHtml = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html');

  if (!sameOrigin) return;

  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response && response.ok) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, copy);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return acceptsHtml ? caches.match('/index.html') : Response.error();
      });
    })
  );
});
