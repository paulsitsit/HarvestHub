import { forwardRef, useId } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      id,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

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
            htmlFor={inputId}
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

        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={[
            'glass-input px-4 py-3',
            error
              ? 'border-red-600 focus:border-red-600 focus:ring-red-100'
              : '',
            className
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

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

Input.displayName = 'Input';

export default Input;