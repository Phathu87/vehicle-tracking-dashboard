import { apiClient } from '@/api/client';

export function getVehicles(options) {
  return apiClient.get('/vehicles', options);
}

export function getVehicle(vehicleId, options) {
  return apiClient.get(`/vehicles/${encodeURIComponent(vehicleId)}`, options);
}

export function getVehicleHistory(vehicleId, { limit = 100, ...options } = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  return apiClient.get(
    `/vehicles/${encodeURIComponent(vehicleId)}/history?${params.toString()}`,
    options,
  );
}
