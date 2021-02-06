// const FILES_TO_CACHE = [
//   "/",
//   "/index.html",
//   "/db.js",
//   "/index.js",
//   "/manifest.webmanifest",
//   "/styles.css",
//   "/icons/icon-192x192.png",
//   "/icons/icon-512x512.png",
// ];

// const CACHE_NAME = "static-cache-v2";
// const DATA_CACHE_NAME = "data-cache-v1";

// // install
// // self.addEventListener("install", function (evt) {
// //   evt.waitUntil(
// //     caches.open(CACHE_NAME).then((cache) => {
// //       console.log("Your files were pre-cached successfully!");
// //       return cache.addAll(FILES_TO_CACHE);
// //     })
// //   );

// //   // self.skipWaiting();
// // });

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then((cache) => cache.addAll(FILES_TO_CACHE))
//       .then(self.skipWaiting())
//   );
// });


// // activate
// self.addEventListener("activate", function (evt) {
//   evt.waitUntil(
//     caches.keys().then((keyList) => {
//       return Promise.all(
//         keyList.map((key) => {
//           if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
//             console.log("Removing old cache data", key);
//             return caches.delete(key);
//           }
//         })
//       );
//     })
//   );

//   self.clients.claim();
// });



// // fetch
// self.addEventListener("fetch", function (evt) {
//   if (evt.request.url.includes("/api/")) {
//     evt.respondWith(
//       caches
//         .open(DATA_CACHE_NAME)
//         .then((cache) => {
//           return fetch(evt.request)
//             .then((response) => {
//               // If the response was good, clone it and store it in the cache.
//               if (response.status === 200) {
//                 cache.put(evt.request.url, response.clone());
//               }

//               return response;
//             })
//             .catch((err) => {
//               // Network request failed, try to get it from the cache.
//               return cache.match(evt.request);
//             });
//         })
//         .catch((err) => console.log(err))
//     );

//     return;
//   }

//   evt.respondWith(
//     fetch(evt.request).catch(function () {
//       return caches.match(evt.request).then(function (response) {
//         if (response) {
//           return response;
//         } else if (evt.request.headers.get("accept").includes("text/html")) {
//           // return the cached home page for all requests for html pages
//           return caches.match("/");
//         }
//       });
//     })
//   );
// });

console.log('hit SW file');
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/db.js",
  "/index.js",
  "/manifest.webmanifest",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
self.addEventListener('install', (evt) => {
  console.log('hit install');
  evt.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(error => console.log('error caching files on install: ', error))
  );
  self.skipWaiting();
});
self.addEventListener('activate', (evt) => {
  console.log('hit activation');
  evt.waitUntil(
    caches
      .keys()
      .then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
      .catch(error => console.log('activation error: ', error))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (evt) => {
  console.log(evt.request.url);
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
            .catch((err) => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );
    return;
  }
  evt.respondWith(
    fetch(evt.request).catch(function () {
      return caches.match(evt.request).then(function (response) {
        if (response) {
          return response;
        } else if (evt.request.headers.get("accept").includes("text/html")) {
          // return the cached home page for all requests for html pages
          return caches.match("/");
        }
      });
    })
  );
});