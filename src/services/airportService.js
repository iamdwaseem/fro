import api from '../api/axiosConfig';

export async function getAirports() {
  return api.get('/airports');
}