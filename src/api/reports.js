import { apiClient } from '@/api/client';

export const reportsApi = {
  maintenance: (vehicleId, options) => apiClient.get(`/maintenance/${encodeURIComponent(vehicleId)}/report`, options),
  trips: (vehicleId, options) => apiClient.get(`/reports/${encodeURIComponent(vehicleId)}/trips`, options),
};
