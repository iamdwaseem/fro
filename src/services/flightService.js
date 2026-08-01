import api from '../api/axiosConfig';

export async function getScheduledFlights() {
  return api.get('/customer/flights/scheduled');
}

export async function searchFlights({ departureAirportId, arrivalAirportId, date }) {
  return api.get('/customer/flights/search', {
    params: {
      departureAirportId,
      arrivalAirportId,
      date,
    },
  });
}

export async function getFlightBookingPage(flightId) {
  return api.get(`/flights/${flightId}/booking`);
}

export async function addFlight(payload) {
  return api.post('/admin/flights', payload);
}

export async function updateFlightStatus(payload) {
  return api.patch('/admin/flights/status', payload);
}