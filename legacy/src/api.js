import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://vehicle-tracking-api.onrender.com/api/';

export async function fetchVehicles() {
  try {
    const response = await axios.get(`${API}/vehicles`);
    return response.data || [];
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const fetchVehicleHistory = async (id) => {
  try {
    const response = await axios.get(`${API}/vehicles/${id}/history`);
    return response.data.history || [];
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
};