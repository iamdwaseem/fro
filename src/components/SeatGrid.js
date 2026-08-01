import { Badge, Button, Card, Col, Row } from 'react-bootstrap';

export default function SeatGrid({ seats = [], selectedSeat = '', onSeatSelect }) {
  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Card.Title className="h5 mb-0">Seat Availability</Card.Title>
          {selectedSeat ? <Badge bg="primary">Selected: {selectedSeat}</Badge> : <Badge bg="secondary">No seat selected</Badge>}
        </div>

        <Row xs={2} sm={3} md={4} lg={6} className="g-2">
          {seats.map((seat) => {
            const isSelected = selectedSeat === seat.seatNumber;

            return (
              <Col key={seat.seatNumber}>
                <Button
                  variant={isSelected ? 'primary' : 'outline-primary'}
                  className={`w-100 d-flex flex-column align-items-center py-3 ${isSelected ? 'fw-semibold' : ''}`}
                  type="button"
                  onClick={() => onSeatSelect?.(seat.seatNumber)}
                >
                  <span>{seat.seatNumber}</span>
                  <small className="text-uppercase opacity-75">{seat.bookingStatus}</small>
                </Button>
              </Col>
            );
          })}
        </Row>
      </Card.Body>
    </Card>
  );
}
