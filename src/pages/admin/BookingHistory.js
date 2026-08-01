import { useEffect, useState } from 'react';
import { Alert, Card, Table } from 'react-bootstrap';
import { adminBookings } from '../../services/bookingService';
import Loader from '../../components/Loader';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminBookings();
      setBookings(res.data || []);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="mb-4">Booking History</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Passenger</th>
                <th>Flight No</th>
                <th>Seat No</th>
                <th>Booking Date</th>
                <th>Total Fare</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={b.bookingId || idx}>
                  <td>{b.bookingId}</td>
                  <td>{b.customerName}</td>
                  <td>{b.passengerName}</td>
                  <td>{b.flightNumber}</td>
                  <td>{b.seatNumber}</td>
                  <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                  <td>${b.totalFare}</td>
                  <td>
                    <span className={`badge bg-${b.status === 'CONFIRMED' ? 'success' : b.status === 'CANCELLED' ? 'danger' : 'secondary'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
