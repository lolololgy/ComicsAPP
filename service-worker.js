// ✅ Geef een duidelijke cache-naam om versies bij te houden
const CACHE_NAME = 'marvel-pwa-cache-v1';

// ✅ Offline fallback-pagina voor als de gebruiker geen internetverbinding heeft
const OFFLINE_URL = 'offline.html';

// ✅ Lijst met bestanden die we vooraf willen cachen tijdens installatie
const ASSETS_TO_CACHE = [
  '/',                        // Hoofdpagina
  '/index.html',              // Startpagina
  '/comics.html',             // Comics-pagina
  '/favorites.html',          // Favorietenpagina
  '/info.html',               // Informatieve pagina
  '/offline.html',            // Offline fallback-pagina
  '/styles/styles.css',       // CSS-stijlen
  '/scripts/main.js',         // Hoofd JavaScript-bestand
  '/scripts/comics.js',       // Logica voor comics-pagina
  '/scripts/favorites.js',    // Logica voor favorietenpagina
  '/scripts/info.js',         // Logica voor info-pagina
  '/assets/icons/icon-192.png',  // App-icoon (192px)
  '/assets/icons/icon-512.png'   // App-icoon (512px)
];

// ✅ Tijdens de 'install' fase worden alle essentiële bestanden gecachet
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.error('Fout bij het cachen tijdens install:', err))
  );
});

// ✅ Tijdens de 'activate' fase worden oude caches opgeschoond
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            // Verwijder oude versies van de cache
            return caches.delete(name);
          }
        })
      );
    }).catch(err => console.error('Fout bij het activeren van service worker:', err))
  );
});

// ✅ Tijdens elke 'fetch' wordt geprobeerd om data van het netwerk te halen,
//    en als dat faalt, dan gebruiken we de cache of vallen we terug op offline.html
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Als fetch werkt, leveren we het resultaat
        return response;
      })
      .catch(() => {
        // Als fetch faalt, probeer het bestand uit de cache te halen
        return caches.match(event.request)
          .then(cachedResponse => {
            // Als het bestand in cache zit, geef dat terug
            return cachedResponse || caches.match(OFFLINE_URL);
          });
      })
  );
});
