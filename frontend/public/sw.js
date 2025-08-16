// Service worker to handle Google OAuth requests properly
self.addEventListener("fetch", (event) => {
  // Skip all Google OAuth and analytics requests to prevent fetch errors
  if (
    event.request.url.includes("accounts.google.com") ||
    event.request.url.includes("googleapis.com") ||
    event.request.url.includes("cloudflareinsights.com") ||
    event.request.url.includes("gsi/log")
  ) {
    // Let these requests pass through without interception
    return;
  }

  // For all other requests, let them pass through normally
  event.respondWith(fetch(event.request));
});

// Handle service worker installation
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim());
});
