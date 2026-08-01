import { Container, Navbar } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-vh-100 bg-body-tertiary">
      <Navbar bg="dark" variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">SB-FRS</Navbar.Brand>
        </Container>
      </Navbar>

      <main>
        <Outlet />
      </main>
    </div>
  );
}