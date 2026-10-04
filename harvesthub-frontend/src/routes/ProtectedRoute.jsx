import {
  Navigate,
  Outlet
} from 'react-router-dom';

import useAuth from '../hooks/useAuth.js';

const ProtectedRoute = ({ children }) => {
  const {
    isAuthenticated,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children || <Outlet />;
};

export default ProtectedRoute;