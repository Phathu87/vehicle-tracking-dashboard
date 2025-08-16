import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchVehicles = async () => (await axios.get(`${API}/vehicles`)).data;
export const fetchVehicleHistory = async (id) =>
  (await axios.get(`${API}/vehicles/${id}/history`)).data.history || [];
