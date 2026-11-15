import { useEffect, useState } from 'react';
import {
  FiArrowLeft,
  FiMapPin,
  FiPhone
} from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import {
  getAdminFarmerById
} from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Badge from '../../components/common/Badge.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import ProductApprovalTable from '../../components/admin/ProductApprovalTable.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getImageUrl } from '../../utils/getImageUrl.js';
import useToast from '../../hooks/useToast.js';

const FarmerDetails = () => {
  const { id } = useParams();
  const { error } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFarmer = async () => {
      try {
        const response =
          await getAdminFarmerById(id);

        if (active) {
          setData(response.data);
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load farmer'
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
      <Loader label="Loading farmer details..." />
    );
  }

  if (!data?.farmer) {
    return (
      <GlassCard className="p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[var(--green-900)]">
          Farmer not found
        </h1>

        <Link
          to="/admin/farmers"
          className="gold-button mt-6"
        >
          Back to farmers
        </Link>
      </GlassCard>
    );
  }

  const {
    farmer,
    products = [],
    productCounts = []
  } = data;

  const farmerImage = farmer.profilePhoto
    ? getImageUrl(farmer.profilePhoto)
    : null;

  return (
    <div className="space-y-8">
      <Link
        to="/admin/farmers"
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--green-700)] hover:underline"
      >
        <FiArrowLeft />
        Back to farmers
      </Link>

      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-[var(--green-100)] text-4xl">
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
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-[var(--green-900)]">
                {farmer.farmName}
              </h1>

              <Badge status={farmer.status} />

              {farmer.isFlaggedFraud && (
                <Badge status="flagged">
                  Fraud flagged
                </Badge>
              )}
            </div>

            <p className="mt-2 text-sm text-[var(--muted)]">
              {farmer.user?.name} · {farmer.user?.email}
            </p>

            <p className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
              <FiMapPin />
              {farmer.address || farmer.municipality || '—'}
              {farmer.province
                ? `, ${farmer.province}`
                : ''}
            </p>

            {farmer.contactNumber && (
              <a
                href={`tel:${farmer.contactNumber}`}
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--green-700)]"
              >
                <FiPhone />
                {farmer.contactNumber}
              </a>
            )}

            <p className="mt-3 text-xs text-[var(--muted)]">
              Registered {formatDate(farmer.createdAt)}
            </p>
          </div>
        </div>

        {farmer.bio && (
          <p className="mt-7 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            {farmer.bio}
          </p>
        )}
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-3">
        {productCounts.map((item) => (
          <GlassCard
            key={item._id}
            className="p-5"
          >
            <p className="text-sm text-[var(--muted)]">
              {item._id}
            </p>

            <p className="mt-2 text-3xl font-extrabold text-[var(--green-900)]">
              {item.count}
            </p>
          </GlassCard>
        ))}
      </div>

      <section>
        <h2 className="mb-5 text-2xl font-extrabold text-[var(--green-900)]">
          Farmer products
        </h2>

        <ProductApprovalTable
          products={products}
          onApprove={() => {}}
          onReject={() => {}}
          onRemove={() => {}}
        />
      </section>
    </div>
  );
};

export default FarmerDetails;