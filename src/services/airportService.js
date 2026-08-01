import api from '../api/axiosConfig';

export async function getAirports() {
  return api.get('/airports');
}

export async function addAirport(payload) {
  return api.post('/airports', payload);
}