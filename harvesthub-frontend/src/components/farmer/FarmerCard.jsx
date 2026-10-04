import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiMapPin
} from 'react-icons/fi';
import GlassCard from '../common/GlassCard.jsx';
import StarRating from '../common/StarRating.jsx';
import {
  API_ORIGIN
} from '../../utils/constants.js';

const FarmerCard = ({ farmer }) => {
  return (
    <GlassCard className="p-5 transition hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--green-100)] text-2xl">
          {farmer.profilePhoto ? (
            <img
              src={`${API_ORIGIN}${farmer.profilePhoto}`}
              alt={`${farmer.farmName} profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            '🌾'
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-lg font-extrabold text-[var(--green-900)]">
              {farmer.farmName}
            </h3>

            <Link
              to={`/farmers/${farmer._id}`}
              aria-label={`View ${farmer.farmName} profile`}
              className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-[var(--green-700)] hover:bg-[var(--green-100)]"
            >
              <FiArrowUpRight />
            </Link>
          </div>

          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--muted)]">
            <FiMapPin size={14} />
            {farmer.municipality || 'Passi City'}
          </p>

          <div className="mt-3">
            <StarRating
              value={farmer.avgRating}
              count={farmer.reviewCount}
            />
          </div>
        </div>
      </div>

      {farmer.bio && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
          {farmer.bio}
        </p>
      )}
    </GlassCard>
  );
};

export default FarmerCard;