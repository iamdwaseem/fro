import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth';
import Dashboard from '../pages/admin/Dashboard';
import Airport from '../pages/admin/Airport';
import Airplane from '../pages/admin/Airplane';
import Flight from '../pages/admin/Flight';
import BookingHistory from '../pages/admin/BookingHistory';

const PAGE_KEYS = {
  DASHBOARD: 'dashboard',
  AIRPORT: 'airport',
  AIRPLANE: 'airplane',
  FLIGHT: 'flight',
  BOOKING_HISTORY: 'bookingHistory',
};

const MENU_ITEMS = [
  { key: PAGE_KEYS.DASHBOARD, label: 'Dashboard' },
  { key: PAGE_KEYS.AIRPORT, label: 'Airport Management' },
  { key: PAGE_KEYS.AIRPLANE, label: 'Airplane Management' },
  { key: PAGE_KEYS.FLIGHT, label: 'Flight Management' },
  { key: PAGE_KEYS.BOOKING_HISTORY, label: 'Booking History' },
  { key: 'logout', label: 'Logout' },
];

export default function AdminLayout() {
  const [activePage, setActivePage] = useState(PAGE_KEYS.DASHBOARD);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleMenuClick = (pageKey) => {
    if (pageKey === 'logout') {
      handleLogout();
      return;
    }
    setActivePage(pageKey);
  };

  const renderContent = () => {
    switch (activePage) {
      case PAGE_KEYS.AIRPORT:
        return <Airport />;
      case PAGE_KEYS.AIRPLANE:
        return <Airplane />;
      case PAGE_KEYS.FLIGHT:
        return <Flight />;
      case PAGE_KEYS.BOOKING_HISTORY:
        return <BookingHistory />;
      case PAGE_KEYS.DASHBOARD:
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-vh-100 bg-body-tertiary d-flex flex-column">
      <Navbar
        brand="SB-FRS Admin"
        userName={user?.userEmail ?? user?.userName ?? 'Admin User'}
        userRole={user?.role ?? 'ADMIN'}
        onLogout={handleLogout}
      />
      <Container fluid className="flex-grow-1">
        <Row className="g-0 min-vh-100">
          <Col xs={12} lg={3} xl={2} className="bg-white border-end">
            <div className="position-sticky top-0" style={{ top: '0' }}>
              <Sidebar menuItems={MENU_ITEMS} activePage={activePage} onMenuClick={handleMenuClick} />
            </div>
          </Col>
          <Col xs={12} lg={9} xl={10} className="p-3 p-md-4">
            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
}