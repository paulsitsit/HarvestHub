import { useCallback, useEffect, useState } from 'react';
import {
  FiCalendar,
  FiMapPin,
  FiPackage
} from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import {
  getPublicProductById
} from '../../api/publicApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Badge from '../../components/common/Badge.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import StarRating from '../../components/common/StarRating.jsx';
import ProductGallery from '../../components/product/ProductGallery.jsx';
import CallFarmerButton from '../../components/product/CallFarmerButton.jsx';
import InquiryForm from '../../components/product/InquiryForm.jsx';
import ReviewList from '../../components/review/ReviewList.jsx';
import ReviewForm from '../../components/review/ReviewForm.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { getImageUrl } from '../../utils/getImageUrl.js';
import useToast from '../../hooks/useToast.js';

const ProductDetails = () => {
  const { id } = useParams();
  const { error } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(async (isActive = () => true) => {
    try {
      const response =
        await getPublicProductById(id);

      if (isActive()) {
        setData(response.data);
      }
    } catch (requestError) {
      if (isActive()) {
        error(
          getApiErrorMessage(
            requestError,
            'Unable to load product'
          )
        );
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [id, error]);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        loadProduct(() => active);
      }
    });

    return () => {
      active = false;
    };
  }, [loadProduct]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading product details..."
      />
    );
  }

  if (!data?.product) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-extrabold text-(--green-900)">
            Product unavailable
          </h1>

          <p className="mt-3 text-sm text-(--muted)">
            This listing may have expired or been removed.
          </p>

          <Link
            to="/products"
            className="gold-button mt-6"
          >
            Back to products
          </Link>
        </GlassCard>
      </div>
    );
  }

  const {
    product,
    reviews = []
  } = data;

  const farmer = product.farmer || {};

  const farmerImage = farmer.profilePhoto
    ? getImageUrl(farmer.profilePhoto)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 pb-28 lg:px-8 lg:pb-10">
      <div className="mb-6 text-sm text-(--muted)">
        <Link
          to="/products"
          className="font-bold text-(--green-700) hover:underline"
        >
          Products
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery
          images={product.images}
          productName={product.name}
        />

        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge status={product.availability} />

              {product.category?.name && (
                <span className="rounded-full bg-(--gold-100) px-3 py-1 text-xs font-bold text-(--gold-600)">
                  {product.category.name}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-4xl font-extrabold text-(--green-900)">
              {product.name}
            </h1>

            <p className="mt-4 text-3xl font-extrabold text-(--gold-600)">
              {formatCurrency(product.price)}
              <span className="ml-2 text-sm font-semibold text-(--muted)">
                per {product.unit}
              </span>
            </p>
          </div>

          <GlassCard className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <FiPackage className="text-(--green-700)" />

                <div>
                  <p className="text-xs text-(--muted)">
                    Availability
                  </p>

                  <p className="font-bold text-(--green-900)">
                    {product.quantity} {product.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiCalendar className="text-(--green-700)" />

                <div>
                  <p className="text-xs text-(--muted)">
                    Harvest date
                  </p>

                  <p className="font-bold text-(--green-900)">
                    {formatDate(product.harvestDate)}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {product.description && (
            <div>
              <h2 className="text-xl font-extrabold text-(--green-900)">
                About this produce
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-8 text-(--muted)">
                {product.description}
              </p>
            </div>
          )}

          <GlassCard className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-(--green-100) text-2xl">
                {farmerImage ? (
                  <img
                    src={farmerImage}
                    alt={`${farmer.farmName} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  '🌾'
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-(--green-700)">
                  Sold by
                </p>

                <Link
                  to={`/farmers/${farmer._id}`}
                  className="mt-1 block truncate text-lg font-extrabold text-(--green-900) hover:text-(--green-700)"
                >
                  {farmer.farmName}
                </Link>

                <p className="mt-1 flex items-center gap-1 text-sm text-(--muted)">
                  <FiMapPin size={14} />
                  {farmer.municipality || 'Passi City'}
                </p>

                <div className="mt-2">
                  <StarRating
                    value={farmer.avgRating}
                    count={farmer.reviewCount}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 hidden sm:block">
              <CallFarmerButton
                product={product}
                farmer={farmer}
              />
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <InquiryForm
          productId={product._id}
        />

        <ReviewList
          reviews={reviews}
          title="Farmer reviews"
        />
      </div>

      <div className="mt-8">
        <ReviewForm
          farmerId={farmer._id}
        />
      </div>

      <CallFarmerButton
        product={product}
        farmer={farmer}
        sticky
      />
    </div>
  );
};

export default ProductDetails;