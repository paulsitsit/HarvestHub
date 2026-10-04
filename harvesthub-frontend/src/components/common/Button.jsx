const Button = ({
  children,
  variant = 'gold',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'outline'
      ? 'green-button'
      : variant === 'danger'
        ? 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-700 bg-red-50 px-4 py-3 font-bold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-700 hover:text-white'
        : variant === 'ghost'
          ? 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-[var(--green-700)] transition hover:bg-[var(--green-100)]'
          : 'gold-button';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        variantClass,
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}

      <span>
        {loading ? 'Please wait...' : children}
      </span>
    </button>
  );
};

export default Button;