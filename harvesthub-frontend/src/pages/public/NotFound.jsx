import { Link } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard.jsx';

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-16">
      <GlassCard className="w-full p-10 text-center">
        <p className="text-7xl font-extrabold text-[var(--green-700)]">
          404
        </p>

        <h1 className="mt-5 text-3xl font-extrabold text-[var(--green-900)]">
          This harvest path is empty.
        </h1>

        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          The page you requested does not exist or may have moved.
        </p>

        <Link
          to="/"
          className="gold-button mt-7"
        >
          Return home
        </Link>
      </GlassCard>
    </div>
  );
};

export default NotFound;