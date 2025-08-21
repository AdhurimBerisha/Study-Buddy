import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import ThemeProvider from "./contexts/ThemeContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Only register service worker in production
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
        // If service worker fails, try to unregister any existing ones
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
