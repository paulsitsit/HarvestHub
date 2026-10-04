const StatCard = ({
  label,
  value,
  icon: Icon,
  tone = 'green',
  description
}) => {
  const toneClass =
    tone === 'gold'
      ? 'bg-[var(--gold-100)] text-[var(--gold-600)]'
      : tone === 'danger'
        ? 'bg-red-100 text-red-700'
        : 'bg-[var(--green-100)] text-[var(--green-700)]';

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--muted)]">
            {label}
          </p>

          <p className="mt-2 text-3xl font-extrabold text-[var(--green-900)]">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={[
              'flex h-11 w-11 items-center justify-center rounded-2xl',
              toneClass
            ].join(' ')}
          >
            <Icon size={21} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;