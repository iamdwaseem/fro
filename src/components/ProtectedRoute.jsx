import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { USER_ROLES } from '../constants/userRole';

function getAllowedRedirectPath(role) {
  if (role === USER_ROLES.ADMIN) {
    return '/admin';
  }

  if (role === USER_ROLES.CUSTOMER) {
    return '/customer';
  }

  return '/';
}

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getAllowedRedirectPath(user?.role)} replace />;
  }

  return <Outlet />;
}