import { FiCalendar, FiCheckCircle } from 'react-icons/fi';
import Badge from '../common/Badge.jsx';
import GlassCard from '../common/GlassCard.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const FeeStatusCard = ({
  product,
  onSubmitPayment
}) => {
  const isActive =
    product.feePaidUntil &&
    new Date(product.feePaidUntil) > new Date();

  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-[var(--green-900)]">
            {product.name}
          </h3>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Listing fee: {formatCurrency(20)}
          </p>
        </div>

        <Badge
          status={isActive ? 'verified' : 'pending'}
        >
          {isActive ? 'Fee active' : 'Payment needed'}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-[var(--muted)]">
          <FiCalendar className="text-[var(--green-700)]" />

          <span>
            Active until:{' '}
            <strong className="text-[var(--green-900)]">
              {formatDate(product.feePaidUntil)}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[var(--muted)]">
          <FiCheckCircle className="text-[var(--green-700)]" />

          <span>
            Product status:{' '}
            <strong className="capitalize text-[var(--green-900)]">
              {product.status}
            </strong>
          </span>
        </div>
      </div>

      {!isActive && (
        <button
          type="button"
          onClick={() => onSubmitPayment(product)}
          className="gold-button mt-5 w-full"
        >
          Submit payment proof
        </button>
      )}
    </GlassCard>
  );
};

export default FeeStatusCard;