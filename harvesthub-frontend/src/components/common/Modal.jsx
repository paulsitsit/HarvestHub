import { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({
  open,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const sizeClass =
    size === 'sm'
      ? 'max-w-md'
      : size === 'lg'
        ? 'max-w-3xl'
        : 'max-w-xl';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="absolute inset-0 bg-[var(--green-900)]/45 backdrop-blur-sm"
        aria-hidden="true"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={[
          'glass-panel relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-3xl p-6',
          sizeClass
        ].join(' ')}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2
            id="modal-title"
            className="text-xl font-extrabold text-[var(--green-900)]"
          >
            {title}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[var(--green-700)] transition hover:bg-[var(--green-100)]"
          >
            <FiX size={22} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
};

export default Modal;