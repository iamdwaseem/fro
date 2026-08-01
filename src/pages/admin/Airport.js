import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { addAirport, getAirports } from '../../services/airportService';
import Loader from '../../components/Loader';

export default function Airport() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ code: '', name: '', city: '', country: '' });

  const fetchAirports = async () => {
    try {
      setLoading(true);
      const res = await getAirports();
      setAirports(res.data || []);
    } catch (err) {
      setError('Failed to load airports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
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
      await addAirport(form);
      setSuccess('Airport added successfully.');
      setForm({ code: '', name: '', city: '', country: '' });
      fetchAirports();
    } catch (err) {
      setError('Failed to add airport.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="mb-4">Airport Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-3">Add Airport</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Control required name="code" value={form.code} onChange={handleChange} placeholder="Airport Code" />
                  </Col>
                  <Col md={3}>
                    <Form.Control required name="name" value={form.name} onChange={handleChange} placeholder="Airport Name" />
                  </Col>
                  <Col md={3}>
                    <Form.Control required name="city" value={form.city} onChange={handleChange} placeholder="City" />
                  </Col>
                  <Col md={3}>
                    <Form.Control required name="country" value={form.country} onChange={handleChange} placeholder="Country" />
                  </Col>
                  <Col md={12}>
                    <Button type="submit" variant="primary" disabled={submitting}>
                      {submitting ? 'Adding...' : 'Add Airport'}
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
          <Card.Title className="mb-3">Airport List</Card.Title>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>City</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((a, idx) => (
                <tr key={a.id || idx}>
                  <td>{a.code}</td>
                  <td>{a.name}</td>
                  <td>{a.city}</td>
                  <td>{a.country}</td>
                </tr>
              ))}
              {airports.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No airports found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
