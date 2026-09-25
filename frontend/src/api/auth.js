import { apiClient } from '@/api/client';

export const authApi = {
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  register(account) {
    return apiClient.post('/auth/register', account);
  },
  me() {
    return apiClient.get('/auth/me');
  },
};
