/**
 * Google tag (gtag.js) initialization.
 *
 * Reads the measurement ID from the VITE_GOOGLE_TAG_ID env variable
 * (set in .env / .env.local) and dynamically injects the gtag.js
 * script into the page <head>.
 *
 * If the variable is not set or invalid the function is a no-op so
 * analytics are only active when explicitly configured.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const GTAG_ID: string | undefined = import.meta.env.VITE_GOOGLE_TAG_ID;

const VALID_GTAG_PREFIX = /^(G|UA|AW|DC)-/;

function gtag(...args: unknown[]): void {
  window.dataLayer.push(args);
}

export function initGoogleTag(): void {
  if (!GTAG_ID || !VALID_GTAG_PREFIX.test(GTAG_ID)) return;

  // 1. Inject the async gtag.js loader
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GTAG_ID)}`;
  document.head.appendChild(script);

  // 2. Initialize the data layer and send the initial config hit
  window.dataLayer = window.dataLayer || [];
  gtag('js', new Date());
  gtag('config', GTAG_ID);
}
