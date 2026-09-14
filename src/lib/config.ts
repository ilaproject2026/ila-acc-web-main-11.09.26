/**
 * Application Configuration
 * Resolves base URL dynamically from .env (VITE_APP_URL / VITE_PORTAL_BASE_URL)
 * with graceful fallback to window.location.origin or production domain.
 */
export const APP_BASE_URL: string = (
  import.meta.env.VITE_APP_URL ||
  import.meta.env.VITE_PORTAL_BASE_URL ||
  (typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ila-acc-web-main-11-09-26-lui063n9t-ila13.vercel.app')
).replace(/\/+$/, '');

/**
 * Sanitizes URLs to always point to the configured APP_BASE_URL,
 * eliminating legacy ilas.global, localhost, or outdated preview domains.
 */
export const sanitizeAppUrl = (url?: string, defaultPath: string = ''): string => {
  if (!url) {
    return defaultPath ? `${APP_BASE_URL}${defaultPath.startsWith('/') || defaultPath.startsWith('#') ? '' : '/'}${defaultPath}` : APP_BASE_URL;
  }
  return url
    .replace(/https?:\/\/ilas\.global/gi, APP_BASE_URL)
    .replace(/https?:\/\/localhost:\d+/gi, APP_BASE_URL)
    .replace(/https?:\/\/ila-acc-web-main-11-09-26-lui063n9t-ila13\.vercel\.app/gi, APP_BASE_URL);
};
