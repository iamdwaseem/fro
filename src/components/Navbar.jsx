import { Container, Nav, Navbar as BootstrapNavbar, Badge, Button } from 'react-bootstrap';

export default function Navbar({ brand = 'SB-FRS', userName = '', userRole = '', onLogout }) {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as="span" className="fw-semibold text-uppercase">
          {brand}
        </BootstrapNavbar.Brand>

        <div className="d-flex align-items-center gap-3 ms-auto flex-wrap">
          <div className="text-end d-none d-md-block">
            <div className="fw-semibold">{userName || 'Guest User'}</div>
            <Badge bg="secondary" pill>
              {userRole || 'GUEST'}
            </Badge>
          </div>

          <Nav>
            <Button variant="outline-light" size="sm" onClick={onLogout} type="button">
              Logout
            </Button>
          </Nav>
        </div>
      </Container>
    </BootstrapNavbar>
  );
}
