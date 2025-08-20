self.addEventListener("fetch", (event) => {
  if (
    event.request.url.includes("accounts.google.com") ||
    event.request.url.includes("googleapis.com") ||
    event.request.url.includes("cloudflareinsights.com") ||
    event.request.url.includes("gsi/log")
  ) {
    return;
  }

  event.respondWith(fetch(event.request));
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim());
});
