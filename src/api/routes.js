import { apiClient } from '@/api/client';

export const routesApi = {
  optimize: (stops, options) => apiClient.post('/routes/optimize', { stops }, options),
};
