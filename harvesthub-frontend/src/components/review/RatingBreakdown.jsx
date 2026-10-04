import StarRating from '../common/StarRating.jsx';

const RatingBreakdown = ({
  average = 0,
  count = 0,
  distribution = []
}) => {
  const distributionMap = new Map(
    distribution.map((item) => [
      Number(item._id),
      Number(item.count)
    ])
  );

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-5">
        <div>
          <p className="text-4xl font-extrabold text-[var(--green-900)]">
            {Number(average || 0).toFixed(1)}
          </p>

          <StarRating value={average} />

          <p className="mt-2 text-xs text-[var(--muted)]">
            Based on {count} review{count === 1 ? '' : 's'}
          </p>
        </div>

        <div className="min-w-[220px] flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const ratingCount =
              distributionMap.get(rating) || 0;

            const percentage = count
              ? (ratingCount / count) * 100
              : 0;

            return (
              <div
                key={rating}
                className="flex items-center gap-2 text-xs"
              >
                <span className="w-8 font-bold text-[var(--muted)]">
                  {rating}★
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--green-100)]">
                  <div
                    className="h-full rounded-full bg-[var(--gold-500)]"
                    style={{
                      width: `${percentage}%`
                    }}
                  />
                </div>

                <span className="w-6 text-right text-[var(--muted)]">
                  {ratingCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingBreakdown;