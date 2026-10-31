// Version du cache : à augmenter avec `engine.js?v=N` dans index.html à chaque modification importante.
const CACHE = 'sudoku-v6';
const FILES = ['./', 'index.html', 'engine.js?v=6', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'];
// `cache: 'reload'` / `'no-cache'` : on contourne le cache HTTP de GitHub Pages (10 min) pour ne jamais mélanger deux versions.
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => Promise.all(FILES.map(f => fetch(new Request(f, {cache: 'reload'})).then(r => c.put(f, r)))))
    .then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, {cache: 'no-cache'}).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request, {ignoreSearch: false}).then(m => m || caches.match(e.request, {ignoreSearch: true}))));
});
