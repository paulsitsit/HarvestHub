import {
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const Pagination = ({
  page = 1,
  pages = 0,
  onPageChange
}) => {
  if (pages <= 1) {
    return null;
  }

  const pageNumbers = [];

  for (let number = 1; number <= pages; number += 1) {
    if (
      number === 1 ||
      number === pages ||
      Math.abs(number - page) <= 1
    ) {
      pageNumbers.push(number);
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--green-700)] text-[var(--green-700)] transition hover:bg-[var(--green-100)] disabled:opacity-40"
      >
        <FiChevronLeft size={18} />
      </button>

      {pageNumbers.map((pageNumber, index) => {
        const previousPage =
          pageNumbers[index - 1];

        const showEllipsis =
          previousPage &&
          pageNumber - previousPage > 1;

        return (
          <span
            key={pageNumber}
            className="flex items-center gap-2"
          >
            {showEllipsis && (
              <span
                aria-hidden="true"
                className="px-1 text-[var(--muted)]"
              >
                …
              </span>
            )}

            <button
              type="button"
              aria-current={
                pageNumber === page
                  ? 'page'
                  : undefined
              }
              onClick={() =>
                onPageChange(pageNumber)
              }
              className={[
                'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-3 font-bold transition',
                pageNumber === page
                  ? 'bg-[var(--green-700)] text-white'
                  : 'border border-[var(--green-700)] text-[var(--green-700)] hover:bg-[var(--green-100)]'
              ].join(' ')}
            >
              {pageNumber}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--green-700)] text-[var(--green-700)] transition hover:bg-[var(--green-100)] disabled:opacity-40"
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;