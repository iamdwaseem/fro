import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { USER_ROLES } from './constants/userRole';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function RouteStub({ title, description }) {
  return (
    <div className="p-4">
      <h1 className="h3 mb-3">{title}</h1>
      <p className="mb-0 text-body-secondary">{description}</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<RouteStub title="Admin Dashboard" description="Admin pages will be added in later phases." />} />
            <Route path="admin/airports" element={<RouteStub title="Airport Management" description="Airport management page will be added in Phase 5." />} />
            <Route path="admin/airplanes" element={<RouteStub title="Airplane Management" description="Airplane management page will be added in Phase 5." />} />
            <Route path="admin/flights" element={<RouteStub title="Flight Management" description="Flight management pages will be added in Phase 5." />} />
            <Route path="admin/bookings" element={<RouteStub title="Booking History" description="Admin booking history will be added in Phase 5." />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]} />}>
          <Route path="customer" element={<CustomerLayout />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppRoutes />;
}