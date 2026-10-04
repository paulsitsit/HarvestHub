import {
  FiEye,
  FiFlag,
  FiRotateCcw,
  FiTrash2
} from 'react-icons/fi';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import GlassCard from '../common/GlassCard.jsx';
import StarRating from '../common/StarRating.jsx';
import { formatDate } from '../../utils/formatDate.js';

const ReviewModerationTable = ({
  reviews = [],
  onHide,
  onFlag,
  onRestore,
  onDelete,
  loadingId
}) => {
  if (!reviews.length) {
    return (
      <EmptyState
        title="No reviews found"
        description="There are no reviews matching your moderation filters."
      />
    );
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left">
          <caption className="sr-only">
            Review moderation table
          </caption>

          <thead className="bg-[var(--green-100)]">
            <tr>
              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Buyer
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Farmer
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Rating
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Comment
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-[var(--green-900)]"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--green-100)]">
            {reviews.map((review) => {
              const isLoading =
                loadingId === review._id;

              return (
                <tr
                  key={review._id}
                  className="transition hover:bg-white/70"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-[var(--green-900)]">
                      {review.buyerName}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {formatDate(review.createdAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-bold text-[var(--green-900)]">
                    {review.farmer?.farmName || 'Unknown'}
                  </td>

                  <td className="px-5 py-4">
                    <StarRating
                      value={review.rating}
                      size={15}
                    />
                  </td>

                  <td className="max-w-sm px-5 py-4">
                    <p className="line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                      {review.comment}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <Badge status={review.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {review.status === 'visible' && (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              onHide(review)
                            }
                            loading={isLoading}
                            aria-label={`Hide review by ${review.buyerName}`}
                          >
                            <FiEye />
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              onFlag(review)
                            }
                            disabled={isLoading}
                            aria-label={`Flag review by ${review.buyerName}`}
                          >
                            <FiFlag />
                          </Button>
                        </>
                      )}

                      {(review.status === 'hidden' ||
                        review.status === 'flagged') && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            onRestore(review)
                          }
                          loading={isLoading}
                          aria-label={`Restore review by ${review.buyerName}`}
                        >
                          <FiRotateCcw />
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        onClick={() =>
                          onDelete(review)
                        }
                        disabled={isLoading}
                        aria-label={`Delete review by ${review.buyerName}`}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default ReviewModerationTable;