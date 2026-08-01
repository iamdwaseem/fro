import api from '../api/axiosConfig';

export async function createBooking(payload) {
  return api.post('/customer/bookings', payload);
}

export async function customerBookings(userId) {
  return api.get(`/customer/bookings/${userId}`);
}

export async function downloadTicket(bookingId) {
  if (!bookingId) {
    throw new Error('A bookingId is required to download a ticket.');
  }
  return api.get(`/customer/bookings/${bookingId}/ticket`, { responseType: 'blob' });
}

export async function adminBookings() {
  return api.get('/admin/bookings');
}

export async function cancelBooking(bookingId) {
  return api.patch(`/customer/bookings/${bookingId}/cancel`);
}