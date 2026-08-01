import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Badge } from 'react-bootstrap';
import SeatGrid from '../../components/SeatGrid';
import ConfirmModal from '../../components/ConfirmModal';
import Loader from '../../components/Loader';
import { createBooking } from '../../services/bookingService';
import { getFlightBookingPage } from '../../services/flightService';

const defaultPassenger = {
  passengerName: '',
  passengerAge: '',
  passengerGender: 'MALE',
};

function extractFlightDetails(response) {
  const data = response?.data ?? response;
  return data?.flightDetails ?? data?.data?.flightDetails ?? data?.flight ?? data ?? null;
}

function extractSeatAvailability(response) {
  const data = response?.data ?? response;
  return data?.seatAvailability ?? data?.data?.seatAvailability ?? data?.seatAvailabilityDto ?? [];
}

function formatCurrency(amount) {
  const numericAmount = Number(amount || 0);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export default function Booking({ flightId, initialFlight, userId, onBackToDetails, onBookingSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [flightDetails, setFlightDetails] = useState(initialFlight ?? null);
  const [seatAvailability, setSeatAvailability] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [seatClass, setSeatClass] = useState('ECONOMY');
  const [passengers, setPassengers] = useState([{ ...defaultPassenger }]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(Boolean(flightId) && !initialFlight);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadBookingPage = async () => {
      if (!flightId) {
        return;
      }

      if (initialFlight) {
        setFlightDetails(initialFlight);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await getFlightBookingPage(flightId);
        const nextFlightDetails = extractFlightDetails(response);
        const nextSeatAvailability = extractSeatAvailability(response);

        if (mounted) {
          setFlightDetails(nextFlightDetails);
          setSeatAvailability(Array.isArray(nextSeatAvailability) ? nextSeatAvailability : []);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError?.response?.data?.message || requestError.message || 'Unable to load booking data.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBookingPage();

    return () => {
      mounted = false;
    };
  }, [flightId, initialFlight]);

  useEffect(() => {
    setPassengers((currentPassengers) => {
      if (currentPassengers.length === passengerCount) {
        return currentPassengers;
      }

      if (currentPassengers.length > passengerCount) {
        return currentPassengers.slice(0, passengerCount);
      }

      return [
        ...currentPassengers,
        ...Array.from({ length: passengerCount - currentPassengers.length }, () => ({ ...defaultPassenger })),
      ];
    });

    setSelectedSeats((currentSeats) => currentSeats.slice(0, passengerCount));
  }, [passengerCount]);

  const farePerPassenger = useMemo(() => {
    if (!flightDetails) {
      return 0;
    }

    if (seatClass === 'BUSINESS') {
      return Number(flightDetails.businessFare || 0);
    }

    if (seatClass === 'FIRST_CLASS') {
      return Number(flightDetails.firstClassFare || 0);
    }

    return Number(flightDetails.economyFare || 0);
  }, [flightDetails, seatClass]);

  const totalFare = useMemo(() => farePerPassenger * passengerCount, [farePerPassenger, passengerCount]);

  const handlePassengerChange = (index, field, value) => {
    setPassengers((currentPassengers) => currentPassengers.map((passenger, passengerIndex) => {
      if (passengerIndex !== index) {
        return passenger;
      }

      return {
        ...passenger,
        [field]: value,
      };
    }));
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seatNumber)) {
        return currentSeats.filter((seat) => seat !== seatNumber);
      }

      if (currentSeats.length >= passengerCount) {
        return [...currentSeats.slice(1), seatNumber];
      }

      return [...currentSeats, seatNumber];
    });
  };

  const buildBookingPayload = () => ({
    userId,
    flightId: flightDetails?.flightId ?? flightId,
    seatClass,
    passengerCount,
    passengers: passengers.map((passenger, index) => ({
      passengerName: passenger.passengerName,
      passengerAge: passenger.passengerAge,
      passengerGender: passenger.passengerGender,
      seatClass,
      seatNumber: selectedSeats[index] ?? selectedSeats[selectedSeats.length - 1] ?? '',
    })),
  });

  const handleSubmitBooking = async () => {
    if (!userId) {
      setError('User information is unavailable. Please log in again.');
      return;
    }

    if (selectedSeats.length < passengerCount) {
      setError('Please select a seat for each passenger.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = buildBookingPayload();
      await createBooking(payload);
      setSuccess('Booking created successfully.');
      setCurrentStep(4);
      setShowConfirmModal(false);

      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading booking details..." />;
  }

  if (error && !flightDetails) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!flightDetails) {
    return <Alert variant="secondary">Select a flight before starting the booking flow.</Alert>;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <div>
          <h1 className="h3 mb-2">Booking</h1>
          <p className="text-body-secondary mb-0">Complete the booking flow inside a single page.</p>
        </div>

        <Button variant="outline-secondary" onClick={onBackToDetails} type="button">
          Back to Flight Details
        </Button>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

      <div className="d-flex gap-2 flex-wrap">
        {['Passenger Details', 'Seat Selection', 'Booking Summary', 'Confirm Booking'].map((label, index) => (
          <Badge key={label} bg={currentStep === index + 1 ? 'primary' : 'secondary'} className="py-2 px-3">
            {index + 1}. {label}
          </Badge>
        ))}
      </div>

      {currentStep === 1 ? (
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="p-4 d-flex flex-column gap-4">
            <div>
              <h2 className="h5 mb-2">Passenger Details</h2>
              <p className="text-body-secondary mb-0">Enter the booking passenger information.</p>
            </div>

            <Row className="g-3">
              <Col md={4}>
                <Form.Group controlId="passengerCount">
                  <Form.Label>Passenger Count</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={passengerCount}
                    onChange={(event) => setPassengerCount(Number(event.target.value || 1))}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="seatClass">
                  <Form.Label>Seat Class</Form.Label>
                  <Form.Select value={seatClass} onChange={(event) => setSeatClass(event.target.value)}>
                    <option value="ECONOMY">ECONOMY</option>
                    <option value="BUSINESS">BUSINESS</option>
                    <option value="FIRST_CLASS">FIRST CLASS</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {passengers.map((passenger, index) => (
              <Row key={`passenger-${index}`} className="g-3 border rounded-4 p-3 bg-body-tertiary">
                <Col md={4}>
                  <Form.Group controlId={`passengerName-${index}`}>
                    <Form.Label>Passenger {index + 1} Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={passenger.passengerName}
                      onChange={(event) => handlePassengerChange(index, 'passengerName', event.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId={`passengerAge-${index}`}>
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={passenger.passengerAge}
                      onChange={(event) => handlePassengerChange(index, 'passengerAge', event.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId={`passengerGender-${index}`}>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={passenger.passengerGender}
                      onChange={(event) => handlePassengerChange(index, 'passengerGender', event.target.value)}
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHER">OTHER</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            ))}

            <div className="d-flex justify-content-end">
              <Button variant="primary" onClick={() => setCurrentStep(2)} type="button">
                Next
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : null}

      {currentStep === 2 ? (
        <div className="d-flex flex-column gap-3">
          <SeatGrid seats={seatAvailability} selectedSeat={selectedSeats[selectedSeats.length - 1] || ''} onSeatSelect={handleSeatSelect} />
          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => setCurrentStep(1)} type="button">
              Back
            </Button>
            <Button variant="primary" onClick={() => setCurrentStep(3)} type="button">
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {currentStep === 3 ? (
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="p-4 d-flex flex-column gap-4">
            <div>
              <h2 className="h5 mb-2">Booking Summary</h2>
              <p className="text-body-secondary mb-0">Review the booking information before confirming.</p>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <div className="text-body-secondary small">Flight</div>
                <div className="fw-semibold">{flightDetails.flightNumber}</div>
              </Col>
              <Col md={6}>
                <div className="text-body-secondary small">Seat Class</div>
                <div className="fw-semibold">{seatClass}</div>
              </Col>
              <Col md={6}>
                <div className="text-body-secondary small">Passenger Count</div>
                <div className="fw-semibold">{passengerCount}</div>
              </Col>
              <Col md={6}>
                <div className="text-body-secondary small">Selected Seats</div>
                <div className="fw-semibold">{selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected'}</div>
              </Col>
              <Col md={12}>
                <div className="text-body-secondary small mb-2">Passengers</div>
                <div className="d-flex flex-column gap-2">
                  {passengers.map((passenger, index) => (
                    <div key={`summary-passenger-${index}`} className="border rounded-3 p-3 bg-body-tertiary">
                      <div className="fw-semibold">{passenger.passengerName || `Passenger ${index + 1}`}</div>
                      <div className="small text-body-secondary">
                        Age: {passenger.passengerAge || '-'} | Gender: {passenger.passengerGender}
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
              <Col md={12}>
                <div className="text-body-secondary small">Total Fare</div>
                <div className="h4 mb-0">{formatCurrency(totalFare)}</div>
              </Col>
            </Row>

            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={() => setCurrentStep(2)} type="button">
                Back
              </Button>
              <Button variant="primary" onClick={() => setShowConfirmModal(true)} type="button">
                Confirm Booking
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : null}

      {currentStep === 4 ? (
        <Card className="shadow-sm border-0 rounded-4 border-success">
          <Card.Body className="p-4">
            <div className="d-flex flex-column gap-2">
              <h2 className="h5 mb-0">Booking Confirmed</h2>
              <p className="text-body-secondary mb-0">The booking request has been submitted successfully.</p>
            </div>
          </Card.Body>
        </Card>
      ) : null}

      <ConfirmModal
        show={showConfirmModal}
        title="Confirm Booking"
        message="Do you want to submit this booking now?"
        confirmButtonText={submitting ? 'Submitting...' : 'Confirm'}
        cancelButtonText="Cancel"
        onConfirm={handleSubmitBooking}
        onCancel={() => setShowConfirmModal(false)}
      />

      {submitting ? <Loader text="Submitting booking..." /> : null}
    </div>
  );
}