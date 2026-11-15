import { useEffect, useState } from 'react';
import {
  FiMapPin,
  FiPhone,
  FiShoppingBag
} from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import {
  getPublicFarmerById
} from '../../api/publicApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import ReviewForm from '../../components/review/ReviewForm.jsx';
import ReviewList from '../../components/review/ReviewList.jsx';
import StarRating from '../../components/common/StarRating.jsx';
import { getImageUrl } from '../../utils/getImageUrl.js';
import useToast from '../../hooks/useToast.js';

const FarmerPublicProfile = () => {
  const { id } = useParams();
  const { error } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFarmer = async () => {
    try {
      const response =
        await getPublicFarmerById(id);

      setData(response.data);
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to load farmer profile'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadFarmer = async () => {
      try {
        const response =
          await getPublicFarmerById(id);

        if (active) {
          setData(response.data);
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load farmer profile'
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadFarmer();

    return () => {
      active = false;
    };
  }, [id, error]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading farmer profile..."
      />
    );
  }

  if (!data?.farmer) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-extrabold text-[var(--green-900)]">
            Farmer not found
          </h1>

          <Link
            to="/products"
            className="gold-button mt-6"
          >
            Browse products
          </Link>
        </GlassCard>
      </div>
    );
  }

  const {
    farmer,
    products = [],
    reviews = []
  } = data;

  const profileImage = farmer.profilePhoto
    ? getImageUrl(farmer.profilePhoto)
    : null;

  const phone =
    farmer.contactNumber ||
    farmer.user?.phone ||
    '';

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <GlassCard
        dark
        className="overflow-hidden rounded-3xl p-7 sm:p-10"
      >
        <div className="flex flex-col gap-7 md:flex-row md:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white/10 text-5xl">
            {profileImage ? (
              <img
                src={profileImage}
                alt={`${farmer.farmName} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              '🌾'
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gold-300)]">
              Local farmer
            </p>

            <h1 className="mt-2 text-4xl font-extrabold">
              {farmer.farmName}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-white/70">
              <FiMapPin />
              {farmer.address || farmer.municipality || 'Passi City'}
              {farmer.province
                ? `, ${farmer.province}`
                : ''}
            </p>

            <div className="mt-4">
              <StarRating
                value={farmer.avgRating}
                count={farmer.reviewCount}
              />
            </div>
          </div>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="gold-button shrink-0"
            >
              <FiPhone />
              Call farmer
            </a>
          )}
        </div>

        {farmer.bio && (
          <p className="mt-8 max-w-3xl leading-8 text-white/70">
            {farmer.bio}
          </p>
        )}
      </GlassCard>

      <section className="mt-10">
        <div className="flex items-center gap-3">
          <FiShoppingBag className="text-[var(--green-700)]" />

          <h2 className="text-3xl font-extrabold text-[var(--green-900)]">
            Products from this farm
          </h2>
        </div>

        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <ReviewList
          reviews={reviews}
          title="Buyer reviews"
        />

        <ReviewForm
          farmerId={farmer._id}
          onSubmitted={fetchFarmer}
        />
      </section>
    </div>
  );
};

export default FarmerPublicProfile;