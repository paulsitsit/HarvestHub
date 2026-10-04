import { FiUser } from 'react-icons/fi';
import StarRating from '../common/StarRating.jsx';
import { formatDate } from '../../utils/formatDate.js';

const ReviewItem = ({ review }) => {
  return (
    <article className="border-b border-[var(--green-100)] py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--green-100)] text-[var(--green-700)]">
            <FiUser />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-[var(--green-900)]">
              {review.buyerName}
            </h3>

            <p className="text-xs text-[var(--muted)]">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        <StarRating
          value={review.rating}
          size={15}
        />
      </div>

      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        {review.comment}
      </p>
    </article>
  );
};

export default ReviewItem;