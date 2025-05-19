export default function generateServiceWorker() {
  return `
    // This service worker can be customized!
    // See https://developers.google.com/web/tools/workbox/modules
    // for the list of available Workbox modules, or add any other
    // code you'd like.
    // You can also remove this file if you'd prefer not to use a
    // service worker, and the Workbox build step will be skipped.

    self.addEventListener('install', (event) => {
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(clients.claim());
    });

    // Add offline caching
    const CACHE_NAME = 'drink-counter-cache-v1';
    const urlsToCache = [
      '/',
      '/manifest.json',
      '/icons/icon-192x192.png',
      '/icons/icon-384x384.png',
      '/icons/icon-512x512.png',
      '/favicon.ico'
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.addAll(urlsToCache);
          })
      );
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            // Cache hit - return response
            if (response) {
              return response;
            }
            return fetch(event.request);
          })
      );
    });
  `;
}