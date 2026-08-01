import api from '../api/axiosConfig';

export async function getWallet(userId) {
  return api.get(`/customer/wallet/${userId}`);
}

export async function addMoney(payload) {
  return api.post('/customer/wallet/add', payload);
}