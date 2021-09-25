var FILES_TO_CACHE = [
  "/",
  "/index.js",
  "/styles.css",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/indexdb.js",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
];

var PRECACHE = "precache-v1";
const DATA_CACHE = "data-cache=v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => {
      console.log("cache opened");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// // The activate handler takes care of cleaning up old caches.
// self.addEventListener('activate', (event) => {
//   const currentCaches = [PRECACHE, RUNTIME];
//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
//       })
//       .then((cachesToDelete) => {
//         return Promise.all(
//           cachesToDelete.map((cacheToDelete) => {
//             return caches.delete(cacheToDelete);
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches
        .open(DATA_CACHE)
        .then((cache) => {
          return fetch(event.request)
            .then((res) => {
              if (res.status === 200) {
                cache.put(event.request.url, res.clone());
              }
              return res;
            })
            .catch(() => cache.match(event.request));
        })
        .catch((err) => console.log(err))
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((res) => {
        if (res) {
          return res;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/");
        }
      });
    })
  );
});
