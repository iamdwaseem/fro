import { Badge, Button, Card, Col, Row } from 'react-bootstrap';

export default function FlightCard({
  flightNumber,
  airplaneName,
  departureAirport,
  arrivalAirport,
  departureTime,
  arrivalTime,
  economyFare,
  businessFare,
  firstClassFare,
  flightStatus,
  actionButtonText = 'View Details',
  onAction,
}) {
  return (
    <Card className="shadow-sm border-0 rounded-4 h-100">
      <Card.Body className="p-4">
        <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
          <div>
            <Card.Title className="h5 mb-1">{flightNumber}</Card.Title>
            <Card.Subtitle className="text-body-secondary">{airplaneName}</Card.Subtitle>
          </div>

          <Badge bg="primary" className="align-self-start">
            {flightStatus}
          </Badge>
        </div>

        <Row className="g-3 mb-3">
          <Col md={6}>
            <div className="text-body-secondary small">Departure</div>
            <div className="fw-semibold">{departureAirport}</div>
            <div className="small">{departureTime}</div>
          </Col>
          <Col md={6}>
            <div className="text-body-secondary small">Arrival</div>
            <div className="fw-semibold">{arrivalAirport}</div>
            <div className="small">{arrivalTime}</div>
          </Col>
        </Row>

        <Row className="g-2 mb-4">
          <Col xs={12} sm={4}>
            <div className="border rounded-3 p-2 text-center bg-body-tertiary">
              <div className="small text-body-secondary">Economy</div>
              <div className="fw-semibold">{economyFare}</div>
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="border rounded-3 p-2 text-center bg-body-tertiary">
              <div className="small text-body-secondary">Business</div>
              <div className="fw-semibold">{businessFare}</div>
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="border rounded-3 p-2 text-center bg-body-tertiary">
              <div className="small text-body-secondary">First Class</div>
              <div className="fw-semibold">{firstClassFare}</div>
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={onAction} type="button">
            {actionButtonText}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
