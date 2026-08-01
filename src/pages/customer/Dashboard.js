import { Card, Col, Row, Button } from 'react-bootstrap';

const DASHBOARD_ITEMS = [
  { key: 'searchFlights', title: 'Search Flights', description: 'Find available flights by route and travel date.', actionLabel: 'Open Search' },
  { key: 'wallet', title: 'Wallet', description: 'Check wallet balance and add money when needed.', actionLabel: 'Open Wallet' },
  { key: 'bookingHistory', title: 'Booking History', description: 'Review bookings and download tickets.', actionLabel: 'View History' },
];

export default function Dashboard({ onNavigate }) {
  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-2">Customer Dashboard</h1>
        <p className="text-body-secondary mb-0">Use the cards below to move through the customer workflow.</p>
      </div>

      <Row className="g-3">
        {DASHBOARD_ITEMS.map((item) => (
          <Col key={item.key} md={4}>
            <Card className="shadow-sm border-0 rounded-4 h-100">
              <Card.Body className="p-4 d-flex flex-column gap-3">
                <div>
                  <Card.Title className="h5">{item.title}</Card.Title>
                  <Card.Text className="text-body-secondary mb-0">{item.description}</Card.Text>
                </div>

                <div className="mt-auto">
                  <Button variant="primary" onClick={() => onNavigate?.(item.key)} type="button">
                    {item.actionLabel}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}