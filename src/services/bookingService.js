import api from '../api/axiosConfig';

export async function createBooking(payload) {
  return api.post('/customer/bookings', payload);
}

export async function customerBookings(userId) {
  return api.get(`/customer/bookings/${userId}`);
}

export async function downloadTicket(bookingId) {
  // TODO: connect this to the backend ticket download endpoint once the API contract is confirmed.
  if (!bookingId) {
    throw new Error('A bookingId is required to download a ticket.');
  }

  throw new Error('Ticket download endpoint is not connected yet.');
}