import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Table, Modal } from 'react-bootstrap';
import { addFlight, getScheduledFlights, updateFlightStatus } from '../../services/flightService';
import { getAirports } from '../../services/airportService';
import { getAirplanes } from '../../services/airplaneService';
import Loader from '../../components/Loader';

export default function Flight() {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [form, setForm] = useState({
    flightNumber: '',
    airplaneId: '',
    departureAirportId: '',
    arrivalAirportId: '',
    departureTime: '',
    arrivalTime: '',
    economyFare: '',
    businessFare: '',
    firstClassFare: ''
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [flightsRes, airportsRes, airplanesRes] = await Promise.all([
        getScheduledFlights(),
        getAirports(),
        getAirplanes()
      ]);
      setFlights(flightsRes.data || []);
      setAirports(airportsRes.data || []);
      setAirplanes(airplanesRes.data || []);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await addFlight({
        ...form,
        economyFare: Number(form.economyFare),
        businessFare: Number(form.businessFare),
        firstClassFare: Number(form.firstClassFare)
      });
      setSuccess('Flight added successfully.');
      setForm({
        flightNumber: '', airplaneId: '', departureAirportId: '', arrivalAirportId: '',
        departureTime: '', arrivalTime: '', economyFare: '', businessFare: '', firstClassFare: ''
      });
      fetchData();
    } catch (err) {
      setError('Failed to add flight.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedFlightId || !newStatus) return;
    try {
      await updateFlightStatus({ flightId: selectedFlightId, status: newStatus });
      setSuccess('Status updated successfully.');
      setShowStatusModal(false);
      fetchData();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="mb-4">Flight Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-3">Add Flight</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Control required name="flightNumber" value={form.flightNumber} onChange={handleChange} placeholder="Flight Number" />
                  </Col>
                  <Col md={3}>
                    <Form.Select required name="airplaneId" value={form.airplaneId} onChange={handleChange}>
                      <option value="">Select Airplane</option>
                      {airplanes.map(a => <option key={a.id} value={a.id}>{a.registrationNumber} ({a.model})</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select required name="departureAirportId" value={form.departureAirportId} onChange={handleChange}>
                      <option value="">Select Departure</option>
                      {airports.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select required name="arrivalAirportId" value={form.arrivalAirportId} onChange={handleChange}>
                      <option value="">Select Arrival</option>
                      {airports.map(a => <option key={a.id} value={a.id}>{a.code}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small mb-1">Departure Time</Form.Label>
                    <Form.Control required type="datetime-local" name="departureTime" value={form.departureTime} onChange={handleChange} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small mb-1">Arrival Time</Form.Label>
                    <Form.Control required type="datetime-local" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="small mb-1">Eco Fare</Form.Label>
                    <Form.Control required type="number" min="0" name="economyFare" value={form.economyFare} onChange={handleChange} />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="small mb-1">Bus Fare</Form.Label>
                    <Form.Control required type="number" min="0" name="businessFare" value={form.businessFare} onChange={handleChange} />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="small mb-1">First Fare</Form.Label>
                    <Form.Control required type="number" min="0" name="firstClassFare" value={form.firstClassFare} onChange={handleChange} />
                  </Col>
                  <Col md={12}>
                    <Button type="submit" variant="primary" disabled={submitting}>
                      {submitting ? 'Adding...' : 'Add Flight'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Card.Title className="mb-3">Flight List</Card.Title>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Flight No</th>
                <th>Airplane</th>
                <th>Route</th>
                <th>Times</th>
                <th>Fares (E/B/F)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f, idx) => (
                <tr key={f.id || f.flightId || idx}>
                  <td>{f.flightNumber}</td>
                  <td>{f.airplane?.registrationNumber}</td>
                  <td>{f.departureAirport?.code} &rarr; {f.arrivalAirport?.code}</td>
                  <td>
                    <div>Dep: {new Date(f.departureTime).toLocaleString()}</div>
                    <div>Arr: {new Date(f.arrivalTime).toLocaleString()}</div>
                  </td>
                  <td>{f.economyFare} / {f.businessFare} / {f.firstClassFare}</td>
                  <td>{f.status}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => {
                      setSelectedFlightId(f.id || f.flightId);
                      setNewStatus(f.status || 'SCHEDULED');
                      setShowStatusModal(true);
                    }}>Update Status</Button>
                  </td>
                </tr>
              ))}
              {flights.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No flights found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Flight Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="DELAYED">DELAYED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleStatusUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
