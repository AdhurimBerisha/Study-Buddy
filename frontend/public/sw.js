self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (
    url.hostname !== location.hostname ||
    url.hostname.includes("accounts.google.com") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("cloudflareinsights.com") ||
    url.hostname.includes("gsi/log")
  ) {
    return;
  }

  if (event.request.mode === "navigate") {
    return;
  }

  if (url.pathname.includes("/verify-email")) {
    return;
  }

  if (event.request.method !== "GET") {
    return;
  }

  if (
    url.pathname.includes(".js") ||
    url.pathname.includes(".css") ||
    url.pathname.includes(".png") ||
    url.pathname.includes(".jpg") ||
    url.pathname.includes(".jpeg") ||
    url.pathname.includes(".gif") ||
    url.pathname.includes(".svg") ||
    url.pathname.includes(".ico") ||
    url.pathname.includes(".woff") ||
    url.pathname.includes(".woff2") ||
    url.pathname.includes(".ttf") ||
    url.pathname.includes(".eot")
  ) {
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.log("Service Worker fetch failed:", error);

        return fetch(event.request);
      })
    );
  }
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim());
});
