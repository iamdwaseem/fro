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