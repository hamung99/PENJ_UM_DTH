const CACHE_NAME = 'rekap-gabungan-v5';
const APP_SHELL = [
  './index.html',
  './penjualan.html',
  './uangmasuk.html',
  './rekap-ar.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for same-origin files (so updates are picked up),
// falling back to cache when offline. Cache-first for everything else (CDN libs, etc).
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isAppShell = url.origin === self.location.origin;

  if (isAppShell) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Simpan hanya respons sukses (jangan cache 404/500)
          if (res && res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((res) => {
            if (res) return res;
            // Fallback ke index.html hanya untuk halaman utama,
            // bukan untuk iframe (supaya tidak muncul app di dalam app)
            if (req.destination === 'document') return caches.match('./index.html');
            return Response.error();
          })
        )
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        }).catch(() => cached);
      })
    );
  }
});
