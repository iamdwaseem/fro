import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { addAirplane, getAirplanes } from '../../services/airplaneService';
import Loader from '../../components/Loader';

export default function Airplane() {
  const [airplanes, setAirplanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    registrationNumber: '',
    model: '',
    economyCapacity: '',
    businessCapacity: '',
    firstClassCapacity: ''
  });

  const fetchAirplanes = async () => {
    try {
      setLoading(true);
      const res = await getAirplanes();
      setAirplanes(res.data || []);
    } catch (err) {
      setError('Failed to load airplanes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirplanes();
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
      await addAirplane({
        ...form,
        economyCapacity: Number(form.economyCapacity),
        businessCapacity: Number(form.businessCapacity),
        firstClassCapacity: Number(form.firstClassCapacity)
      });
      setSuccess('Airplane added successfully.');
      setForm({ registrationNumber: '', model: '', economyCapacity: '', businessCapacity: '', firstClassCapacity: '' });
      fetchAirplanes();
    } catch (err) {
      setError('Failed to add airplane.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="mb-4">Airplane Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-3">Add Airplane</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={2}>
                    <Form.Control required name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="Reg. No" />
                  </Col>
                  <Col md={2}>
                    <Form.Control required name="model" value={form.model} onChange={handleChange} placeholder="Model" />
                  </Col>
                  <Col md={2}>
                    <Form.Control type="number" required min="0" name="economyCapacity" value={form.economyCapacity} onChange={handleChange} placeholder="Economy" />
                  </Col>
                  <Col md={2}>
                    <Form.Control type="number" required min="0" name="businessCapacity" value={form.businessCapacity} onChange={handleChange} placeholder="Business" />
                  </Col>
                  <Col md={2}>
                    <Form.Control type="number" required min="0" name="firstClassCapacity" value={form.firstClassCapacity} onChange={handleChange} placeholder="First Class" />
                  </Col>
                  <Col md={2}>
                    <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
                      {submitting ? 'Adding...' : 'Add Airplane'}
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
          <Card.Title className="mb-3">Airplane List</Card.Title>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Registration</th>
                <th>Model</th>
                <th>Economy</th>
                <th>Business</th>
                <th>First Class</th>
              </tr>
            </thead>
            <tbody>
              {airplanes.map((a, idx) => (
                <tr key={a.id || idx}>
                  <td>{a.registrationNumber}</td>
                  <td>{a.model}</td>
                  <td>{a.economyCapacity}</td>
                  <td>{a.businessCapacity}</td>
                  <td>{a.firstClassCapacity}</td>
                </tr>
              ))}
              {airplanes.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No airplanes found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
