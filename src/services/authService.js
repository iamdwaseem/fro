import api from '../api/axiosConfig';

export async function login(payload) {
  return api.post('/user/login', payload);
}

export async function register(payload) {
  if (!payload) {
    throw new Error('Registration payload is required.');
  }

  return api.post('/user/register', payload);
}