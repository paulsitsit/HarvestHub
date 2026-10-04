import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { API_ORIGIN } from '../../utils/constants.js';

const fallbackImage =
  'https://placehold.co/1000x750/e6f7ec/14753f?text=HarvestHub';

const getImageUrl = (image) => {
  if (!image) {
    return fallbackImage;
  }

  if (image.startsWith('http')) {
    return image;
  }

  return `${API_ORIGIN}${image}`;
};

const ProductGallery = ({
  images = [],
  productName = 'Product'
}) => {
  const normalizedImages =
    images.length > 0 ? images : [fallbackImage];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const activeImage =
    normalizedImages[activeIndex] ||
    normalizedImages[0];

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? normalizedImages.length - 1
        : current - 1
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === normalizedImages.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--green-100)]">
        <img
          src={getImageUrl(activeImage)}
          alt={`${productName} image ${activeIndex + 1}`}
          className="h-full w-full object-cover"
        />

        {normalizedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-100 transition hover:bg-black/75 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <FiChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-100 transition hover:bg-black/75 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <FiChevronRight size={22} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white">
          {activeIndex + 1} / {normalizedImages.length}
        </div>
      </div>

      {normalizedImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {normalizedImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show product image ${index + 1}`}
              className={[
                'aspect-square overflow-hidden rounded-xl border-2 transition',
                activeIndex === index
                  ? 'border-[var(--gold-500)] ring-2 ring-[var(--gold-300)]'
                  : 'border-transparent opacity-70 hover:opacity-100'
              ].join(' ')}
            >
              <img
                src={getImageUrl(image)}
                alt={`${productName} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;