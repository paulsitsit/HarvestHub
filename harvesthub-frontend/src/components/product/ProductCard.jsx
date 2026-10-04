import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiMapPin,
  FiPackage
} from 'react-icons/fi';
import GlassCard from '../common/GlassCard.jsx';
import Badge from '../common/Badge.jsx';
import StarRating from '../common/StarRating.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import {
  getImageUrl,
  PLACEHOLDER_IMAGE
} from '../../utils/getImageUrl.js';

const ProductCard = ({ product }) => {
  const farmer = product.farmer || {};

  return (
    <GlassCard className="group overflow-hidden p-0 transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
      <Link
        to={`/products/${product._id}`}
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--green-100)]">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3">
            <Badge status={product.availability} />
          </div>

          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
            {product.category?.name || 'Produce'}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-lg font-extrabold text-[var(--green-900)]">
              {product.name}
            </h3>

            <FiArrowUpRight
              className="shrink-0 text-[var(--green-500)] transition group-hover:-translate-y-1 group-hover:translate-x-1"
              size={20}
            />
          </div>

          <p className="mt-3 text-xl font-extrabold text-[var(--gold-600)]">
            {formatCurrency(product.price)}
            <span className="ml-1 text-xs font-semibold text-[var(--muted)]">
              / {product.unit}
            </span>
          </p>

          <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <FiPackage className="text-[var(--green-700)]" />
              {product.quantity} {product.unit} available
            </span>

            <span className="flex items-center gap-2">
              <FiMapPin className="text-[var(--green-700)]" />
              {farmer.municipality || 'Passi City'}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--green-100)] pt-4">
            <span className="truncate text-sm font-bold text-[var(--green-900)]">
              {farmer.farmName || 'Local farmer'}
            </span>

            <StarRating
              value={farmer.avgRating}
              count={farmer.reviewCount}
              size={14}
            />
          </div>
        </div>
      </Link>
    </GlassCard>
  );
};

export default ProductCard;