import { apiClient } from '@/api/client';

export const driversApi = {
  list: (options) => apiClient.get('/drivers', options),
  get: (id, options) => apiClient.get(`/drivers/${encodeURIComponent(id)}`, options),
  create: (driver, options) => apiClient.post('/drivers', driver, options),
  update: (id, driver, options) => apiClient.put(`/drivers/${encodeURIComponent(id)}`, driver, options),
  remove: (id, options) => apiClient.delete(`/drivers/${encodeURIComponent(id)}`, options),
  assignVehicles: (id, vehicleIds, options) => apiClient.put(`/drivers/${encodeURIComponent(id)}/vehicles`, { vehicleIds }, options),
};
