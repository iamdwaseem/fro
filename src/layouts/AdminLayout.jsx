import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row className="g-0 min-vh-100">
        <Col xs={12} lg={3} xl={2} className="bg-dark text-white p-4">
          <div className="fw-semibold text-uppercase small mb-3">Admin Area</div>
          <div className="text-white-50 small">Sidebar navigation will be added in Phase 3.</div>
        </Col>

        <Col xs={12} lg={9} xl={10} className="p-3 p-md-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}