const Loader = ({
  label = 'Loading...',
  fullScreen = false
}) => {
  return (
    <div
      className={[
        'flex items-center justify-center gap-3',
        fullScreen ? 'min-h-screen' : 'py-12'
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="h-7 w-7 animate-spin rounded-full border-4 border-[var(--green-100)] border-t-[var(--green-700)]"
      />

      <span className="text-sm font-semibold text-[var(--muted)]">
        {label}
      </span>
    </div>
  );
};

export default Loader;