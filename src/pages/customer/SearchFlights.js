import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import FlightCard from '../../components/FlightCard';
import Loader from '../../components/Loader';
import { getAirports } from '../../services/airportService';
import { searchFlights } from '../../services/flightService';

const initialSearch = {
  departureAirportId: '',
  arrivalAirportId: '',
  date: '',
};

function getResponseList(response) {
  return response?.data?.data ?? response?.data ?? [];
}

export default function SearchFlights({ onViewDetails }) {
  const [searchForm, setSearchForm] = useState(initialSearch);
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadAirports = async () => {
      setLoadingAirports(true);
      setError('');

      try {
        const response = await getAirports();
        const nextAirports = getResponseList(response);

        if (mounted) {
          setAirports(Array.isArray(nextAirports) ? nextAirports : []);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError?.response?.data?.message || requestError.message || 'Unable to load airports.');
        }
      } finally {
        if (mounted) {
          setLoadingAirports(false);
        }
      }
    };

    loadAirports();

    return () => {
      mounted = false;
    };
  }, []);

  const airportOptions = useMemo(() => airports.map((airport) => {
    const airportId = airport.airportId ?? airport.id ?? airport.value;
    const label = airport.airportName || airport.name || airport.airportCode || String(airportId ?? '');

    return { airportId, label };
  }), [airports]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSearchForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoadingSearch(true);
    setError('');
    setInfoMessage('');

    try {
      const response = await searchFlights({
        departureAirportId: searchForm.departureAirportId,
        arrivalAirportId: searchForm.arrivalAirportId,
        date: searchForm.date,
      });

      const nextFlights = getResponseList(response);
      setFlights(Array.isArray(nextFlights) ? nextFlights : []);

      if (!nextFlights || nextFlights.length === 0) {
        setInfoMessage('No flights matched the selected criteria.');
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to search flights.');
      setFlights([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  if (loadingAirports) {
    return <Loader text="Loading airports..." />;
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-2">Search Flights</h1>
        <p className="text-body-secondary mb-0">Search by departure, arrival, and journey date.</p>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {infoMessage ? <Alert variant="info">{infoMessage}</Alert> : null}

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-4">
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col md={4}>
                <Form.Group controlId="departureAirportId">
                  <Form.Label>Departure Airport</Form.Label>
                  <Form.Select name="departureAirportId" value={searchForm.departureAirportId} onChange={handleChange} required>
                    <option value="">Select departure airport</option>
                    {airportOptions.map((airport) => (
                      <option key={airport.airportId} value={airport.airportId}>
                        {airport.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="arrivalAirportId">
                  <Form.Label>Arrival Airport</Form.Label>
                  <Form.Select name="arrivalAirportId" value={searchForm.arrivalAirportId} onChange={handleChange} required>
                    <option value="">Select arrival airport</option>
                    {airportOptions.map((airport) => (
                      <option key={airport.airportId} value={airport.airportId}>
                        {airport.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="journeyDate">
                  <Form.Label>Journey Date</Form.Label>
                  <Form.Control type="date" name="date" value={searchForm.date} onChange={handleChange} required />
                </Form.Group>
              </Col>

              <Col md={1} className="d-grid">
                <Button type="submit" variant="primary" disabled={loadingSearch}>
                  {loadingSearch ? 'Searching...' : 'Search'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loadingSearch ? <Loader text="Searching flights..." /> : null}

      {!loadingSearch && flights.length > 0 ? (
        <Row className="g-3">
          {flights.map((flight) => (
            <Col key={flight.flightId ?? flight.id} xl={6}>
              <FlightCard
                flightNumber={flight.flightNumber}
                airplaneName={flight.airplaneName}
                departureAirport={flight.departureAirport?.airportName || flight.departureAirport?.name || flight.departureAirport}
                arrivalAirport={flight.arrivalAirport?.airportName || flight.arrivalAirport?.name || flight.arrivalAirport}
                departureTime={flight.departureTime}
                arrivalTime={flight.arrivalTime}
                economyFare={flight.economyFare}
                businessFare={flight.businessFare}
                firstClassFare={flight.firstClassFare}
                flightStatus={flight.status || flight.flightStatus}
                actionButtonText="View Details"
                onAction={() => onViewDetails?.(flight)}
              />
            </Col>
          ))}
        </Row>
      ) : null}

      {!loadingSearch && flights.length === 0 && !infoMessage && !error ? (
        <Alert variant="secondary">Search results will appear here.</Alert>
      ) : null}
    </div>
  );
}