import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container className="py-5">
      <Row className="align-items-center g-4 g-lg-5">
        <Col lg={6}>
          <div className="text-uppercase text-primary fw-semibold mb-2">Airline Reservation System</div>
          <h1 className="display-5 fw-bold mb-3">Book flights with a clean, simple reservation experience.</h1>
          <p className="lead text-body-secondary mb-4">
            Manage flight reservations, customer bookings, and wallet actions through a structured Spring Boot backend.
          </p>

          <div className="d-flex gap-3 flex-wrap">
            <Button as={Link} to="/login" variant="primary" size="lg">
              Login
            </Button>
            <Button as={Link} to="/register" variant="outline-primary" size="lg">
              Register
            </Button>
          </div>
        </Col>

        <Col lg={6}>
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-5 bg-primary text-white">
              <div className="d-flex flex-column justify-content-between gap-4 min-vh-25">
                <div className="display-1 lh-1">✈</div>
                <div>
                  <h2 className="h1 fw-bold mb-3">Travel planning made simple.</h2>
                  <p className="mb-0 text-white-75">
                    Start your journey with a clean reservation experience designed for booking, managing, and tracking flights.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}