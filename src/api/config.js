export function resolveApiBaseUrl(environment = {}) {
  const configured = environment.VITE_API_URL;
  if (configured !== undefined && typeof configured !== 'string') {
    throw new Error('VITE_API_URL must be a public API URL.');
  }
  const base = configured?.trim().replace(/\/+$/, '') || (environment.PROD ? '' : 'http://localhost:3001/api');
  let url;
  try { url = new URL(base); } catch {
    throw new Error('Configure VITE_API_URL as an absolute API URL ending in /api.');
  }
  const local = /^(?:localhost\.?|127(?:\.\d+){3}|0\.0\.0\.0|\[::1\])$/.test(url.hostname)
    || /\.localhost\.?$/.test(url.hostname);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash
    || url.pathname !== '/api' || (environment.PROD && (url.protocol !== 'https:' || local))) {
    throw new Error('VITE_API_URL must end in one /api prefix and use a non-local HTTPS origin in production.');
  }
  return base;
}
