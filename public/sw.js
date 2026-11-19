/**
 * Service Worker para ConectaEdu (PWA)
 * Suporte a navegação resiliente e cache de recursos estáticos da aplicação
 */
const CACHE_NAME = 'conectaedu-cache-v4';
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
            console.log('🧹 ConectaEdu SW: Limpando cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // NUNCA interceptar ou armazenar em cache: gravador, áudios, vídeos ou rotas de API
  if (
    url.includes('/api/') || 
    url.includes('recorder') || 
    url.includes('demo-video') || 
    url.includes('/audio/') || 
    url.includes('demonstracao_poc')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Estratégia Network-First para desenvolvimento confiável
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
