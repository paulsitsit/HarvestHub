import {
  Navigate,
  Outlet
} from 'react-router-dom';

import useAuth from '../hooks/useAuth.js';

const RoleRoute = ({
  allowedRoles = [],
  children
}) => {
  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children || <Outlet />;
};

export default RoleRoute;