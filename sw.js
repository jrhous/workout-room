const CACHE = 'iron-room-v1';

// Local assets to pre-cache on install
const LOCAL_ASSETS = [
  '/',
  '/index.html',
  '/workouts.js',
  '/store.js',
  '/components.jsx',
  '/screens.jsx',
  '/app.jsx',
  '/manifest.json',
  '/icon.svg',
  '/prototypes/app/styles.css',
];

// CDN origins to cache at runtime (cache-first)
const CDN_ORIGINS = [
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── Install: pre-cache local assets ──────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(LOCAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for CDN, network-first for local ───────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isCDN = CDN_ORIGINS.some(o => url.hostname.includes(o));

  if (isCDN) {
    // Cache-first: serve CDN resources from cache, fetch + cache on miss
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
          return response;
        });
      })
    );
  } else {
    // Network-first for local assets: try network, fall back to cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request)
          .then(cached => cached || caches.match('/index.html'))
        )
    );
  }
});
