import { authApi, validateSession } from '../api/auth.js';
import { getAccessToken, setAccessToken } from '../api/client.js';

export function establishAuthSession(response, { persistent = false } = {}) {
  const { token, user } = validateSession(response);
  setAccessToken(token, { persistent });
  return user;
}

export function clearAuthSession() {
  setAccessToken(null);
}

export async function restoreAuthSession() {
  const token = getAccessToken();
  if (!token) return { status: 'guest', user: null, authError: null };
  try {
    return { status: 'authenticated', user: await authApi.me(), authError: null };
  } catch (authError) {
    const denied = authError.status === 401 || authError.status === 403;
    if (denied && getAccessToken() === token) clearAuthSession();
    return { status: denied ? 'guest' : 'unavailable', user: null, authError };
  }
}
