/**
 * Service Worker para ConectaEdu (PWA)
 * Suporte a navegação resiliente e cache de recursos estáticos
 */
const CACHE_NAME = 'conectaedu-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/curator.html',
  '/css/style.css',
  '/js/app.js',
  '/js/curator.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 ConectaEdu SW: Pré-carregando recursos essenciais em cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições de API para manter dados atualizados
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    }).catch(() => {
      // Fallback para index offline se for navegação
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
