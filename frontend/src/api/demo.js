import { apiClient } from '@/api/client';

export const demoApi = {
  status: (options) => apiClient.get('/demo/status', options),
};
