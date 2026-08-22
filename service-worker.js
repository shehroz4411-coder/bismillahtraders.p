/* =========================================================
   SPANISH FAST FOOD - SERVICE WORKER
   Offline support & caching
========================================================= */

const CACHE_NAME = "spanish-fastfood-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/spanish.css",
  "/script.js",
  "/manifest.json",
  "/menu.html",
  "/about.html",
  "/gallery.html",
  "/contact.html",
  "/developer.html"
];

// Install event - cache static assets
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log("SPANISH: Caching assets...");
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        console.log("SPANISH: Installation complete!");
        return self.skipWaiting();
      })
      .catch(function (error) {
        console.error("SPANISH: Cache error:", error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log("SPANISH: Removing old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function () {
        console.log("SPANISH: Activation complete!");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(function (networkResponse) {
            // Don't cache if not a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              })
              .catch(function (error) {
                console.error("SPANISH: Cache put error:", error);
              });

            return networkResponse;
          })
          .catch(function () {
            // Network failed - return fallback page for HTML requests
            if (event.request.headers.get("accept").includes("text/html")) {
              return caches.match("/index.html");
            }
          });
      })
  );
});

// Push notification event
self.addEventListener("push", function (event) {
  const title = "SPANISH Fast Food";
  const options = {
    body: event.data ? event.data.text() : "Your order is being prepared! 🍔",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});

console.log("SPANISH: Service Worker loaded successfully!");