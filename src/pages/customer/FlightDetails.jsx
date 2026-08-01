import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import Loader from '../../components/Loader';
import { getFlightBookingPage } from '../../services/flightService';

function resolveFlightDetails(response) {
  const data = response?.data ?? response;
  return data?.flightDetails ?? data?.data?.flightDetails ?? data?.flight ?? data ?? null;
}

export default function FlightDetails({ flightId, initialFlight, onBookFlight, onBackToSearch }) {
  const [flightDetails, setFlightDetails] = useState(initialFlight ?? null);
  const [loading, setLoading] = useState(Boolean(flightId) && !initialFlight);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadFlight = async () => {
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
        const nextFlight = resolveFlightDetails(response);

        if (mounted) {
          setFlightDetails(nextFlight);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError?.response?.data?.message || requestError.message || 'Unable to load flight details.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFlight();

    return () => {
      mounted = false;
    };
  }, [flightId, initialFlight]);

  if (loading) {
    return <Loader text="Loading flight details..." />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!flightDetails) {
    return <Alert variant="secondary">Select a flight to view its details.</Alert>;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <div>
          <h1 className="h3 mb-2">Flight Details</h1>
          <p className="text-body-secondary mb-0">Review the flight information before starting the booking flow.</p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Button variant="outline-secondary" onClick={onBackToSearch} type="button">
            Back to Search
          </Button>
          <Button variant="primary" onClick={() => onBookFlight?.(flightDetails)} type="button">
            Book Flight
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-4">
          <Row className="g-4">
            <Col md={6}>
              <div className="text-body-secondary small">Flight Number</div>
              <div className="fw-semibold">{flightDetails.flightNumber}</div>
            </Col>
            <Col md={6}>
              <div className="text-body-secondary small">Airplane</div>
              <div className="fw-semibold">{flightDetails.airplaneName || flightDetails.airplane?.airplaneName}</div>
            </Col>
            <Col md={6}>
              <div className="text-body-secondary small">Departure Airport</div>
              <div className="fw-semibold">{flightDetails.departureAirport?.airportName || flightDetails.departureAirport?.name || flightDetails.departureAirport}</div>
            </Col>
            <Col md={6}>
              <div className="text-body-secondary small">Arrival Airport</div>
              <div className="fw-semibold">{flightDetails.arrivalAirport?.airportName || flightDetails.arrivalAirport?.name || flightDetails.arrivalAirport}</div>
            </Col>
            <Col md={6}>
              <div className="text-body-secondary small">Departure Time</div>
              <div className="fw-semibold">{flightDetails.departureTime}</div>
            </Col>
            <Col md={6}>
              <div className="text-body-secondary small">Arrival Time</div>
              <div className="fw-semibold">{flightDetails.arrivalTime}</div>
            </Col>
            <Col md={4}>
              <div className="text-body-secondary small">Economy Fare</div>
              <div className="fw-semibold">{flightDetails.economyFare}</div>
            </Col>
            <Col md={4}>
              <div className="text-body-secondary small">Business Fare</div>
              <div className="fw-semibold">{flightDetails.businessFare}</div>
            </Col>
            <Col md={4}>
              <div className="text-body-secondary small">First Class Fare</div>
              <div className="fw-semibold">{flightDetails.firstClassFare}</div>
            </Col>
            <Col md={12}>
              <div className="text-body-secondary small">Flight Status</div>
              <div className="fw-semibold">{flightDetails.status || flightDetails.flightStatus}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}