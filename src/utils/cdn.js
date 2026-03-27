const ALLOWED_ORIGINS = ['https://d2iume3cn1sk35.cloudfront.net'];

/**
 * Enterprise CDN URL Provider
 * Returns the validated CDN URL from environment variables.
 * Ensures the origin is allowed to prevent malicious redirection.
 */
export const cdnUrl = (() => {
  const url = import.meta.env.VITE_CDN_URL || '';
  if (!url) return '';
  try {
    const origin = new URL(url).origin;
    return ALLOWED_ORIGINS.includes(origin) ? url : '';
  } catch {
    return '';
  }
})();
