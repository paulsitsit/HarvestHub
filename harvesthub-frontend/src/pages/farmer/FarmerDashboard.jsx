import { useEffect, useState } from 'react';
import {
  FiBell,
  FiBox,
  FiCreditCard,
  FiMessageSquare,
  FiPlus,
  FiStar
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  getFarmerDashboard
} from '../../api/farmerApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Badge from '../../components/common/Badge.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const FarmerDashboard = () => {
  const {
    farmerProfile,
    refreshUser
  } = useAuth();

  const { error } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const response =
          await getFarmerDashboard();

        if (active) {
          setData(response.data);
          await refreshUser();
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load dashboard'
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [error, refreshUser]);

  if (loading) {
    return (
      <Loader label="Loading farmer dashboard..." />
    );
  }

  const stats = data?.stats || {};
  const profile = data?.profile || farmerProfile;
  const recentInquiries = data?.recentInquiries || [];

  const accountStatus =
    profile?.status || 'pending';

  const statusMessage = {
    pending:
      'Your account is waiting for administrator approval.',
    approved:
      'Your account is approved and can publish listings after product approval and fee verification.',
    rejected:
      profile?.rejectionReason ||
      'Your account was rejected. Please review your profile information.',
    suspended:
      'Your account is suspended. Contact the administrator for assistance.'
  }[accountStatus];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
            Farmer dashboard
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
            Welcome, {profile?.user?.name || 'farmer'}
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Keep your farm information, listings, and inquiries up
            to date.
          </p>
        </div>

        <Link
          to="/farmer/products/add"
          className="gold-button"
        >
          <FiPlus />
          Add product
        </Link>
      </div>

      <GlassCard
        className={[
          'border-l-4 p-5',
          accountStatus === 'approved'
            ? 'border-l-[var(--green-700)]'
            : accountStatus === 'rejected' ||
                accountStatus === 'suspended'
              ? 'border-l-red-600'
              : 'border-l-[var(--gold-500)]'
        ].join(' ')}
      >
        <div className="flex flex-wrap items-start gap-4">
          <FiBell
            size={22}
            className="mt-1 text-[var(--green-700)]"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-extrabold text-[var(--green-900)]">
                Account status
              </h2>

              <Badge status={accountStatus} />
            </div>

            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {statusMessage}
            </p>

            {accountStatus !== 'approved' && (
              <Link
                to="/farmer/profile"
                className="mt-3 inline-flex text-sm font-extrabold text-[var(--green-700)] hover:underline"
              >
                Review your profile
              </Link>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Active products"
          value={stats.activeProducts || 0}
          icon={FiBox}
        />

        <StatCard
          label="Pending products"
          value={stats.pendingProducts || 0}
          icon={FiBox}
          tone="gold"
        />

        <StatCard
          label="New inquiries"
          value={stats.newInquiries || 0}
          icon={FiMessageSquare}
        />

        <StatCard
          label="Average rating"
          value={Number(stats.averageRating || 0).toFixed(1)}
          icon={FiStar}
          tone="gold"
        />

        <StatCard
          label="Pending fees"
          value={stats.pendingPayments || 0}
          icon={FiCreditCard}
          tone="danger"
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <GlassCard className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--green-900)]">
                Recent inquiries
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Follow up with buyers who contacted you.
              </p>
            </div>

            <Link
              to="/farmer/inquiries"
              className="text-sm font-extrabold text-[var(--green-700)] hover:underline"
            >
              View all
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="py-12 text-center">
              <FiMessageSquare
                size={30}
                className="mx-auto text-[var(--green-300)]"
              />

              <p className="mt-3 text-sm font-bold text-[var(--green-900)]">
                No inquiries yet
              </p>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Buyer messages will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-[var(--green-100)]">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-bold text-[var(--green-900)]">
                      {inquiry.product?.name || 'Product inquiry'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {inquiry.buyerName} ·{' '}
                      {formatDate(inquiry.createdAt)}
                    </p>
                  </div>

                  <Badge status={inquiry.status} />
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard
          dark
          className="p-6"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gold-300)]">
            Listing fee
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            {formatCurrency(20)}
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/70">
            Each verified payment activates one approved product
            listing for 30 days.
          </p>

          <Link
            to="/farmer/payments"
            className="gold-button mt-6"
          >
            Manage payments
          </Link>
        </GlassCard>
      </div>
    </div>
  );
};

export default FarmerDashboard;