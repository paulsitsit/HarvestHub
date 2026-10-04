import { FiStar } from 'react-icons/fi';

const StarRating = ({
  value = 0,
  count,
  size = 17,
  interactive = false,
  onChange,
  label = 'Rating'
}) => {
  const normalizedValue = Math.min(
    Math.max(Number(value) || 0, 0),
    5
  );

  return (
    <div
      className="inline-flex items-center gap-1"
      aria-label={`${label}: ${normalizedValue.toFixed(1)} out of 5`}
    >
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= normalizedValue;

          if (interactive) {
            return (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} out of 5`}
                onClick={() => onChange?.(star)}
                className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-[var(--gold-500)] transition hover:bg-[var(--gold-100)]"
              >
                <FiStar
                  size={size}
                  fill={
                    isActive
                      ? 'currentColor'
                      : 'transparent'
                  }
                  strokeWidth={1.8}
                />
              </button>
            );
          }

          return (
            <FiStar
              key={star}
              size={size}
              className={
                isActive
                  ? 'text-[var(--gold-500)]'
                  : 'text-slate-300'
              }
              fill={
                isActive
                  ? 'currentColor'
                  : 'transparent'
              }
              strokeWidth={1.8}
            />
          );
        })}
      </div>

      {count !== undefined && (
        <span className="ml-1 text-xs text-[var(--muted)]">
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;