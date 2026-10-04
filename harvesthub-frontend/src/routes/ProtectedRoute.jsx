import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const ProtectedRoute = () => {
  const {
    isAuthenticated,
    loading
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface)]">
        <div className="glass-panel rounded-2xl px-6 py-5 text-sm font-semibold text-[var(--green-900)]">
          Loading your account...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;