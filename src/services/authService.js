import api from '../api/axiosConfig';

export async function login() {
  // TODO: Connect to the backend login endpoint when it is available.
  throw new Error('Authentication endpoint is not connected yet.');
}

export async function register(payload) {
  // TODO: Connect to the backend register endpoint when it is available.
  // The request shape is preserved here for the later backend integration.
  if (!payload) {
    throw new Error('Registration payload is required.');
  }

  return api.post('/user/register', payload);
}