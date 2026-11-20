import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { resolveApiBaseUrl } from '../api/config.js';
import { API_BASE_URL, apiClient, getAccessToken, setAccessToken } from '../api/client.js';
import { authApi, validateCurrentUser, validateSession } from '../api/auth.js';
import { clearAuthSession, establishAuthSession, restoreAuthSession } from '../lib/authSession.js';

const user = { id: 'fictional-user-id', username: 'disposable.operator', name: 'Disposable Operator', role: 'user' };
const token = 'synthetic-local-session';
const original = Object.fromEntries(['fetch', 'window', 'localStorage', 'sessionStorage', 'CustomEvent'].map((key) => [key, globalThis[key]]));
let requests;
let events;
let scheduledTimeout;

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

beforeEach(() => {
  requests = [];
  events = [];
  scheduledTimeout = null;
  globalThis.localStorage = memoryStorage();
  globalThis.sessionStorage = memoryStorage();
  globalThis.CustomEvent = class { constructor(type) { this.type = type; } };
  globalThis.window = {
    setTimeout: (callback, milliseconds) => { scheduledTimeout = milliseconds; return setTimeout(callback, milliseconds); },
    clearTimeout, dispatchEvent: (event) => events.push(event.type),
  };
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return json({ token, user });
  };
});

afterEach(() => {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete globalThis[key];
    else globalThis[key] = value;
  }
});

test('DIRECT production configuration is explicit, normalized and never same-origin', () => {
  const base = 'https://fleet-drive-ai-api.onrender.com/api';
  assert.equal(resolveApiBaseUrl({ PROD: true, VITE_API_URL: ` ${base}/// ` }), base);
  assert.equal(resolveApiBaseUrl({ PROD: false }), 'http://localhost:3001/api');
  assert.equal(resolveApiBaseUrl({ VITE_API_URL: 'http://localhost:4100/api' }), 'http://localhost:4100/api');
  for (const value of [undefined, '', '/api', 'http://localhost:3001/api', 'https://localhost/api', 'https://127.0.0.1/api',
    base + '/api', base + '/auth', base + '?secret=not-allowed', base + '#fragment',
    'https://name:password@example.com/api', 'ftp://example.com/api']) {
    assert.throws(() => resolveApiBaseUrl({ PROD: true, VITE_API_URL: value }));
  }
});

test('auth URLs and payloads append exactly one api prefix without changing login contract', async () => {
  const credentials = { username: user.username, password: 'SyntheticTestPassword!', rememberMe: true };
  assert.deepEqual(await authApi.login(credentials), { token, user });
  assert.equal(requests[0].url, API_BASE_URL + '/auth/login');
  assert.equal(requests[0].options.method, 'POST');
  assert.deepEqual(JSON.parse(requests[0].options.body), credentials);
  await authApi.register({ username: user.username, password: 'SyntheticTestPassword!' });
  assert.equal(requests[1].url, API_BASE_URL + '/auth/register');
  assert.equal(requests[1].options.headers.has('X-Registration-Invite'), false);
  assert.ok(requests.every(({ url }) => !url.includes('/api/api/')));
});

test('HTML success responses never create login, registration or restored sessions', async () => {
  globalThis.fetch = async () => new Response('<html>Not an API</html>', { headers: { 'Content-Type': 'text/html' } });
  for (const operation of [() => authApi.login({}), () => authApi.register({}), () => authApi.me()]) {
    await assert.rejects(operation(), (error) => error.code === 'INVALID_API_RESPONSE' && error.body === null);
  }
  assert.equal(getAccessToken(), null);
  setAccessToken(token);
  const restored = await restoreAuthSession();
  assert.equal(restored.status, 'unavailable');
  assert.equal(restored.user, null);
  assert.equal(getAccessToken(), token);
});

test('malformed JSON, empty JSON and missing content type are rejected; 204 remains usable for deletes', async () => {
  for (const [body, headers] of [['invalid', { 'Content-Type': 'application/json' }], ['', { 'Content-Type': 'application/json' }], ['{}', {}]]) {
    globalThis.fetch = async () => new Response(body, { headers });
    await assert.rejects(apiClient.get('/auth/me'), (error) => error.code === 'INVALID_API_RESPONSE');
  }
  globalThis.fetch = async () => new Response(null, { status: 204 });
  assert.equal(await apiClient.delete('/unused-test-resource'), null);
  await assert.rejects(authApi.me(), (error) => error.code === 'INVALID_AUTH_RESPONSE');
});

test('malformed auth JSON cannot establish a session or retain extra private fields', async () => {
  for (const invalid of [null, [], {}, 'html', { ...user, role: 'superuser' }, { ...user, id: '' }]) {
    assert.throws(() => validateCurrentUser(invalid), (error) => error.code === 'INVALID_AUTH_RESPONSE');
  }
  for (const invalid of [null, {}, { token: '', user }, { token, user: null }, { token, user: 'html' }]) {
    assert.throws(() => establishAuthSession(invalid), (error) => error.code === 'INVALID_AUTH_RESPONSE');
    assert.equal(getAccessToken(), null);
  }
  assert.deepEqual(validateCurrentUser({ ...user, password_hash: 'synthetic-hidden-value' }), user);
  assert.deepEqual(validateSession({ token, user, unused: true }), { token, user });
});

test('structured validation, admission, duplicate, rate-limit and backend errors retain status and code', async () => {
  for (const [status, code] of [[400, 'VALIDATION_ERROR'], [401, 'INVALID_CREDENTIALS'], [403, 'REGISTRATION_UNAVAILABLE'],
    [409, 'USERNAME_EXISTS'], [429, 'AUTH_RATE_LIMITED'], [500, 'INTERNAL_ERROR'], [503, 'UNAVAILABLE']]) {
    globalThis.fetch = async () => json({ error: { code, message: 'Safe structured error.', details: {} } }, status);
    await assert.rejects(authApi.login({}), (error) => error.status === status && error.code === code);
  }
});

test('HTML gateway errors are safe failures, and HTML 401 still clears a stored session', async () => {
  globalThis.fetch = async () => new Response('<html>Gateway details</html>', { status: 503, headers: { 'Content-Type': 'text/html' } });
  await assert.rejects(apiClient.get('/health'), (error) => error.status === 503 && error.body === null && !error.message.includes('Gateway details'));
  setAccessToken(token);
  globalThis.fetch = async () => new Response('<html>Unauthorized</html>', { status: 401, headers: { 'Content-Type': 'text/html' } });
  await assert.rejects(authApi.me());
  assert.equal(getAccessToken(), null);
  assert.deepEqual(events, ['fleet-drive:unauthorized']);
});

test('remembered and session-only tokens restore through a real me contract and logout clears both stores', async () => {
  establishAuthSession({ token, user }, { persistent: true });
  assert.equal(localStorage.getItem('fleet-drive:token'), token);
  assert.equal(sessionStorage.getItem('fleet-drive:token'), null);
  globalThis.fetch = async (url, options) => {
    assert.equal(url, API_BASE_URL + '/auth/me');
    assert.equal(options.headers.get('Authorization'), `Bearer ${token}`);
    return json(user);
  };
  assert.deepEqual(await restoreAuthSession(), { status: 'authenticated', user, authError: null });
  clearAuthSession();
  assert.equal(getAccessToken(), null);
  assert.equal((await restoreAuthSession()).status, 'guest');
  establishAuthSession({ token, user });
  assert.equal(localStorage.getItem('fleet-drive:token'), null);
  assert.equal(sessionStorage.getItem('fleet-drive:token'), token);
  clearAuthSession();
  assert.equal(getAccessToken(), null);
});

test('expired and forbidden sessions become guests; temporary backend failure preserves retryable sign-in', async () => {
  for (const status of [401, 403]) {
    setAccessToken(token);
    globalThis.fetch = async () => json({ error: { code: 'AUTH_REQUIRED', message: 'Sign in again.' } }, status);
    const restored = await restoreAuthSession();
    assert.equal(restored.status, 'guest');
    assert.equal(restored.user, null);
    assert.equal(getAccessToken(), null);
  }
  setAccessToken(token);
  globalThis.fetch = async () => json({ error: { code: 'UNAVAILABLE', message: 'Try later.' } }, 503);
  assert.equal((await restoreAuthSession()).status, 'unavailable');
  assert.equal(getAccessToken(), token);
});

test('network failures do not expose raw request errors or retry POST operations', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Synthetic sensitive transport detail'); };
  await assert.rejects(authApi.login({}), (error) => error.code === 'NETWORK_ERROR' && error.details === null);
  assert.equal(calls, 1);
});

test('a late unauthorized response cannot clear a newer sign-in token', async () => {
  setAccessToken('synthetic-older-session');
  let finish;
  globalThis.fetch = () => new Promise((resolve) => { finish = resolve; });
  const pending = restoreAuthSession();
  setAccessToken('synthetic-newer-session');
  finish(json({ error: { code: 'AUTH_REQUIRED', message: 'Old session expired.' } }, 401));
  await pending;
  assert.equal(getAccessToken(), 'synthetic-newer-session');
  assert.deepEqual(events, []);
});

test('cold-start timeout is bounded and explicit user cancellation remains separate', async () => {
  window.setTimeout = (callback, milliseconds) => { scheduledTimeout = milliseconds; return setTimeout(callback, 0); };
  globalThis.fetch = async (url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('Synthetic abort')), { once: true });
  });
  await assert.rejects(authApi.login({}), (error) => error.code === 'TIMEOUT' && error.message.includes('may be starting'));
  assert.equal(scheduledTimeout, 75000);
  const controller = new AbortController();
  controller.abort();
  globalThis.fetch = async () => { throw new Error('Synthetic cancellation'); };
  await assert.rejects(apiClient.get('/health', { signal: controller.signal }), (error) => error.code === 'ABORTED');
});

test('timeout also covers a stalled JSON response body', async () => {
  window.setTimeout = (callback) => setTimeout(callback, 0);
  globalThis.fetch = async (url, options) => ({
    status: 200, headers: new Headers({ 'Content-Type': 'application/json' }),
    text: () => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('Synthetic body timeout')), { once: true });
    }),
  });
  await assert.rejects(authApi.me(), (error) => error.code === 'TIMEOUT');
});
