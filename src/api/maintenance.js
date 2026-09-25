import { apiClient } from '@/api/client';

export const maintenanceApi = {
  list: (options) => apiClient.get('/maintenance', options),
  forVehicle: (vehicleId, options) => apiClient.get(`/vehicles/${encodeURIComponent(vehicleId)}/maintenance`, options),
  create: (vehicleId, task, options) => apiClient.post(`/vehicles/${encodeURIComponent(vehicleId)}/maintenance`, task, options),
  update: (vehicleId, taskId, task, options) => apiClient.put(`/vehicles/${encodeURIComponent(vehicleId)}/maintenance/${taskId}`, task, options),
  complete: (vehicleId, taskId, mileage, options) => apiClient.post(`/vehicles/${encodeURIComponent(vehicleId)}/maintenance/${taskId}/complete`, { mileage }, options),
  remove: (vehicleId, taskId, options) => apiClient.delete(`/vehicles/${encodeURIComponent(vehicleId)}/maintenance/${taskId}`, options),
};
