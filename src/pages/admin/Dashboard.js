import { Card, Col, Row } from 'react-bootstrap';

export default function Dashboard({ onNavigate }) {
  const cards = [
    { title: 'Airport Management', key: 'airport', bg: 'primary' },
    { title: 'Airplane Management', key: 'airplane', bg: 'success' },
    { title: 'Flight Management', key: 'flight', bg: 'info' },
    { title: 'Booking History', key: 'bookingHistory', bg: 'warning' }
  ];

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row className="g-4">
        {cards.map((c) => (
          <Col md={6} lg={3} key={c.key}>
            <Card
              className={`text-white bg-${c.bg} h-100 shadow-sm border-0`}
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate(c.key)}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4 py-5">
                <h5 className="mb-0 text-center fw-bold">{c.title}</h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
