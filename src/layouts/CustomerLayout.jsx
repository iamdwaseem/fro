import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth';
import Dashboard from '../pages/customer/Dashboard';
import SearchFlights from '../pages/customer/SearchFlights';
import FlightDetails from '../pages/customer/FlightDetails';
import Booking from '../pages/customer/Booking';
import Wallet from '../pages/customer/Wallet';
import BookingHistory from '../pages/customer/BookingHistory';

const PAGE_KEYS = {
  DASHBOARD: 'dashboard',
  SEARCH_FLIGHTS: 'searchFlights',
  FLIGHT_DETAILS: 'flightDetails',
  BOOKING: 'booking',
  WALLET: 'wallet',
  BOOKING_HISTORY: 'bookingHistory',
};

const MENU_ITEMS = [
  { key: PAGE_KEYS.DASHBOARD, label: 'Dashboard' },
  { key: PAGE_KEYS.SEARCH_FLIGHTS, label: 'Search Flights' },
  { key: PAGE_KEYS.WALLET, label: 'Wallet' },
  { key: PAGE_KEYS.BOOKING_HISTORY, label: 'Booking History' },
  { key: 'logout', label: 'Logout' },
];

export default function CustomerLayout() {
  const [activePage, setActivePage] = useState(PAGE_KEYS.DASHBOARD);
  const [selectedFlight, setSelectedFlight] = useState(null);
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

  const openFlightDetails = (flight) => {
    setSelectedFlight(flight);
    setActivePage(PAGE_KEYS.FLIGHT_DETAILS);
  };

  const openBooking = (flight) => {
    setSelectedFlight(flight || selectedFlight);
    setActivePage(PAGE_KEYS.BOOKING);
  };

  const renderContent = () => {
    switch (activePage) {
      case PAGE_KEYS.SEARCH_FLIGHTS:
        return <SearchFlights onViewDetails={openFlightDetails} />;
      case PAGE_KEYS.FLIGHT_DETAILS:
        return (
          <FlightDetails
            flightId={selectedFlight?.flightId ?? selectedFlight?.id ?? null}
            initialFlight={selectedFlight}
            onBookFlight={openBooking}
            onBackToSearch={() => setActivePage(PAGE_KEYS.SEARCH_FLIGHTS)}
          />
        );
      case PAGE_KEYS.BOOKING:
        return (
          <Booking
            flightId={selectedFlight?.flightId ?? selectedFlight?.id ?? null}
            initialFlight={selectedFlight}
            userId={user?.userId ?? user?.id ?? null}
            onBackToDetails={() => setActivePage(PAGE_KEYS.FLIGHT_DETAILS)}
            onBookingSuccess={() => setActivePage(PAGE_KEYS.BOOKING_HISTORY)}
          />
        );
      case PAGE_KEYS.WALLET:
        return <Wallet />;
      case PAGE_KEYS.BOOKING_HISTORY:
        return <BookingHistory />;
      case PAGE_KEYS.DASHBOARD:
      default:
        return (
          <Dashboard
            onNavigate={(pageKey) => {
              if (pageKey === PAGE_KEYS.SEARCH_FLIGHTS) {
                setActivePage(PAGE_KEYS.SEARCH_FLIGHTS);
                return;
              }

              if (pageKey === PAGE_KEYS.WALLET) {
                setActivePage(PAGE_KEYS.WALLET);
                return;
              }

              if (pageKey === PAGE_KEYS.BOOKING_HISTORY) {
                setActivePage(PAGE_KEYS.BOOKING_HISTORY);
              }
            }}
          />
        );
    }
  };

  return (
    <div className="min-vh-100 bg-body-tertiary d-flex flex-column">
      <Navbar
        brand="SB-FRS"
        userName={user?.userEmail ?? user?.userName ?? 'Guest User'}
        userRole={user?.role ?? 'CUSTOMER'}
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