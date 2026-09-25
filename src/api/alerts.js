import { apiClient } from '@/api/client';

export const alertsApi = {
  list: (options) => apiClient.get('/alerts', options),
  types: (options) => apiClient.get('/alerts/types', options),
};
