import { resolveApiBaseUrl } from './config.js';

const TOKEN_STORAGE_KEY = 'fleet-drive:token';
const UNAUTHORIZED_EVENT = 'fleet-drive:unauthorized';
const REQUEST_TIMEOUT_MS = 75_000;

async function readResponseBody(response) {
  if (response.status === 204) return null;
  const mediaType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (mediaType === 'application/json' || /^application\/[\w.+-]+\+json$/.test(mediaType)) {
    const text = await response.text();
    try { return JSON.parse(text); } catch { /* Fall through to a safe contract error. */ }
  }
  throw new ApiError(response.status >= 500
    ? 'The Fleet Drive API is temporarily unavailable. Please try again.'
    : 'The Fleet Drive API returned an unexpected response. Please try again.', {
    status: response.status,
    code: 'INVALID_API_RESPONSE',
  });
}

export const API_BASE_URL = resolveApiBaseUrl(import.meta.env || {});

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'API_ERROR', details = null, body = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.body = body;
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAccessToken(token, { persistent = false } = {}) {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  if (token) {
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function onUnauthorized(listener) {
  window.addEventListener(UNAUTHORIZED_EVENT, listener);
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, listener);
}

async function request(path, options = {}) {
  const { body, headers, ...fetchOptions } = options;
  const token = getAccessToken();
  const requestHeaders = new Headers(headers);

  requestHeaders.set('Accept', 'application/json');
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

  let response;
  let responseBody;
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);
  const signal = fetchOptions.signal
    ? AbortSignal.any([fetchOptions.signal, timeoutController.signal])
    : timeoutController.signal;
  try {
    response = await fetch(`${API_BASE_URL}/${path.replace(/^\/+/, '')}`, {
      ...fetchOptions,
      headers: requestHeaders,
      signal,
      body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    });
    if (response.status === 401 && getAccessToken() === token) {
      setAccessToken(null);
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    responseBody = await readResponseBody(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (timeoutController.signal.aborted && !fetchOptions.signal?.aborted) {
      throw new ApiError('The demo API may be starting. The request timed out; please try again.', {
        code: 'TIMEOUT',
        details: `No complete API response within ${REQUEST_TIMEOUT_MS / 1000} seconds.`,
      });
    }
    if (fetchOptions.signal?.aborted) {
      throw new ApiError('The API request was cancelled.', { code: 'ABORTED' });
    }
    throw new ApiError('Unable to reach the Fleet Drive API.', {
      code: 'NETWORK_ERROR',
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const apiError = responseBody?.error;
    throw new ApiError(
      (typeof apiError?.message === 'string' && apiError.message)
        || (response.status >= 500 ? 'The Fleet Drive API is temporarily unavailable. Please try again.' : 'The API request failed.'),
      {
        status: response.status,
        code: typeof apiError?.code === 'string' ? apiError.code : `HTTP_${response.status}`,
        details: apiError?.details || null,
        body: responseBody,
      },
    );
  }

  return responseBody;
}

export const apiClient = {
  request,
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
