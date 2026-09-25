import { apiClient } from '@/api/client';

export const geofencesApi = {
  list: (options) => apiClient.get('/geofences', options),
  get: (id, options) => apiClient.get(`/geofences/${encodeURIComponent(id)}`, options),
  create: (value, options) => apiClient.post('/geofences', value, options),
  update: (id, value, options) => apiClient.put(`/geofences/${encodeURIComponent(id)}`, value, options),
  remove: (id, options) => apiClient.delete(`/geofences/${encodeURIComponent(id)}`, options),
  check: (id, vehicleId, options) => {
    const query = vehicleId ? `?vehicleId=${encodeURIComponent(vehicleId)}` : '';
    return apiClient.get(`/geofences/${encodeURIComponent(id)}/check${query}`, options);
  },
};
