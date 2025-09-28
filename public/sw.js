// Establish a cache name from the package.json version
const version = "0.1.1";
const cacheName = `cache:${version}`;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      const allowedKeys = [cacheName];

      return Promise.all(
        keys.map((key) => {
          if (!allowedKeys.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  if(event.request.url.includes("chrome-extension")) return;
  
  // Open the cache
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      // Go to the network first
      return fetch(event.request.url)
        .then((fetchedResponse) => {
          cache.put(event.request, fetchedResponse.clone());
          return fetchedResponse;
        })
        .catch(() => {
          // If the network is unavailable, get
          return cache.match(event.request.url);
        });
    })
  );
});
