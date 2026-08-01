import { useEffect, useState } from 'react';
import { Alert, Button, Card, Table } from 'react-bootstrap';
import Loader from '../../components/Loader';
import useAuth from '../../hooks/useAuth';
import { customerBookings, downloadTicket } from '../../services/bookingService';

function getBookingsList(response) {
  return response?.data?.data ?? response?.data ?? [];
}

export default function BookingHistory() {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id ?? null;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadBookings = async () => {
      if (!userId) {
        setError('User information is unavailable. Please log in again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setInfoMessage('');

      try {
        const response = await customerBookings(userId);
        const nextBookings = getBookingsList(response);

        if (mounted) {
          setBookings(Array.isArray(nextBookings) ? nextBookings : []);

          if (!nextBookings || nextBookings.length === 0) {
            setInfoMessage('No bookings found.');
          }
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError?.response?.data?.message || requestError.message || 'Unable to load booking history.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleDownloadTicket = async (bookingId) => {
    try {
      await downloadTicket(bookingId);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to download ticket.');
    }
  };

  if (loading) {
    return <Loader text="Loading booking history..." />;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-2">Booking History</h1>
        <p className="text-body-secondary mb-0">Review customer bookings and download tickets.</p>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {infoMessage ? <Alert variant="info">{infoMessage}</Alert> : null}

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Booking ID</th>
                <th>Flight Number</th>
                <th>Passenger Name</th>
                <th>Seat Number</th>
                <th>Booking Status</th>
                <th>Total Fare</th>
                <th>Booking Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId ?? booking.id}>
                  <td>{booking.bookingId ?? booking.id}</td>
                  <td>{booking.flightNumber}</td>
                  <td>{booking.passengerName}</td>
                  <td>{booking.seatNumber}</td>
                  <td>{booking.bookingStatus}</td>
                  <td>{booking.totalFare}</td>
                  <td>{booking.bookingDate ?? booking.createdAt}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => handleDownloadTicket(booking.bookingId ?? booking.id)} type="button">
                      Download Ticket
                    </Button>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-body-secondary py-4">
                    No booking history available.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}