import { apiClient, ApiError } from './client.js';

export function validateCurrentUser(response) {
  if (!response || typeof response !== 'object' || Array.isArray(response)
    || !['id', 'username', 'name'].every((field) => typeof response[field] === 'string' && response[field].trim())
    || !['user', 'admin'].includes(response.role)) {
    throw new ApiError('The API returned an invalid authentication response.', { code: 'INVALID_AUTH_RESPONSE' });
  }
  return { id: response.id, username: response.username, name: response.name, role: response.role };
}

export function validateSession(response) {
  if (!response || typeof response.token !== 'string' || !response.token.trim()) {
    throw new ApiError('The API returned an invalid authentication response.', { code: 'INVALID_AUTH_RESPONSE' });
  }
  return { token: response.token, user: validateCurrentUser(response.user) };
}

export const authApi = {
  login(credentials) {
    return apiClient.post('/auth/login', credentials).then(validateSession);
  },
  register(account) {
    return apiClient.post('/auth/register', account).then(validateSession);
  },
  me() {
    return apiClient.get('/auth/me').then(validateCurrentUser);
  },
};
