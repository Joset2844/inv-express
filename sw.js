// Network-first: siempre intenta la versión más reciente; usa caché solo sin conexión.
const CACHE = "inventario-v" + Date.now();
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("message", e => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request, { cache: "no-store" }).then(r => {
      const copia = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
