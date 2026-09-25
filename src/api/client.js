const DEFAULT_API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
const TOKEN_STORAGE_KEY = 'fleet-drive:token';
const UNAUTHORIZED_EVENT = 'fleet-drive:unauthorized';
const REQUEST_TIMEOUT_MS = 15_000;

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, '');
}

function readResponseBody(response) {
  if (response.status === 204) return Promise.resolve(null);

  return response.text().then((text) => {
    if (!text) return null;

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }

    return text;
  });
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL,
);

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
  } catch (error) {
    if (timeoutController.signal.aborted && !fetchOptions.signal?.aborted) {
      throw new ApiError('The Fleet Drive API request timed out.', {
        code: 'TIMEOUT',
        details: `No response within ${REQUEST_TIMEOUT_MS / 1000} seconds.`,
      });
    }
    throw new ApiError('Unable to reach the Fleet Drive API.', {
      code: 'NETWORK_ERROR',
      details: error instanceof Error ? error.message : null,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

  const responseBody = await readResponseBody(response);

  if (response.status === 401) {
    setAccessToken(null);
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }

  if (!response.ok) {
    const apiError = responseBody?.error;
    throw new ApiError(
      apiError?.message || response.statusText || 'The API request failed.',
      {
        status: response.status,
        code: apiError?.code || `HTTP_${response.status}`,
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
