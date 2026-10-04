import { forwardRef, useId } from 'react';

const Select = forwardRef(
  (
    {
      label,
      error,
      hint,
      id,
      required = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

    const describedBy = [
      hint ? hintId : '',
      error ? errorId : ''
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-bold text-[var(--green-900)]"
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="ml-1 text-red-700"
              >
                *
              </span>
            )}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={[
            'glass-input glass-select px-4 py-3',
            error ? 'border-red-600' : '',
            className
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {children}
        </select>

        {hint && !error && (
          <p
            id={hintId}
            className="text-xs text-[var(--muted)]"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-semibold text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;