import api from '../api/axiosConfig';

export async function getAirplanes() {
  return api.get('/airplanes');
}

export async function addAirplane(payload) {
  return api.post('/airplanes', payload);
}
