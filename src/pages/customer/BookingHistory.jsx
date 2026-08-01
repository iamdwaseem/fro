import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Table } from 'react-bootstrap';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';
import useAuth from '../../hooks/useAuth';
import { customerBookings, downloadTicket, cancelBooking } from '../../services/bookingService';

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
  const [success, setSuccess] = useState('');
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelId, setSelectedCancelId] = useState(null);
  const [canceling, setCanceling] = useState(false);

  const fetchBookings = async () => {
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
      setBookings(Array.isArray(nextBookings) ? nextBookings : []);
      if (!nextBookings || nextBookings.length === 0) {
        setInfoMessage('No bookings found.');
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to load booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleDownloadTicket = async (bookingId) => {
    try {
      const res = await downloadTicket(bookingId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('Ticket downloaded successfully!');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to download ticket.');
    }
  };

  const handleCancelClick = (bookingId) => {
    setSelectedCancelId(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedCancelId) return;
    setCanceling(true);
    setError('');
    try {
      await cancelBooking(selectedCancelId);
      setSuccess('Booking cancelled successfully.');
      setShowCancelModal(false);
      fetchBookings();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to cancel booking.');
    } finally {
      setCanceling(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'CONFIRMED') return 'success';
    if (status === 'CANCELLED') return 'danger';
    if (status === 'WAITING') return 'warning';
    return 'secondary';
  };

  if (loading) {
    return <Loader text="Loading booking history..." />;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-2">Booking History</h1>
        <p className="text-body-secondary mb-0">Review customer bookings, manage cancellations, and download tickets.</p>
      </div>

      {error ? <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert> : null}
      {success ? <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert> : null}
      {infoMessage ? <Alert variant="info">{infoMessage}</Alert> : null}

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Booking ID</th>
                <th>Flight No</th>
                <th>Route</th>
                <th>Timings</th>
                <th>Passenger</th>
                <th>Seat</th>
                <th>Class</th>
                <th>Total Fare</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId ?? booking.id}>
                  <td>{booking.bookingId ?? booking.id}</td>
                  <td>{booking.flightNumber}</td>
                  <td>{booking.departureAirport} &rarr; {booking.arrivalAirport}</td>
                  <td>
                    <div className="small">Dep: {booking.departureTime ? new Date(booking.departureTime).toLocaleString() : '-'}</div>
                    <div className="small">Arr: {booking.arrivalTime ? new Date(booking.arrivalTime).toLocaleString() : '-'}</div>
                  </td>
                  <td>{booking.passengerName}</td>
                  <td>{booking.seatNumber}</td>
                  <td>{booking.seatClass}</td>
                  <td>${booking.totalFare}</td>
                  <td>{new Date(booking.bookingDate ?? booking.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={getStatusBadge(booking.bookingStatus || booking.status)}>
                      {booking.bookingStatus || booking.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => handleDownloadTicket(booking.bookingId ?? booking.id)} type="button">
                        Ticket
                      </Button>
                      {(booking.bookingStatus === 'CONFIRMED' || booking.status === 'CONFIRMED') && (
                        <Button variant="outline-danger" size="sm" onClick={() => handleCancelClick(booking.bookingId ?? booking.id)} type="button">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-body-secondary py-4">
                    No booking history available.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showCancelModal}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmButtonText={canceling ? 'Canceling...' : 'Cancel Booking'}
        cancelButtonText="Keep Booking"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
}