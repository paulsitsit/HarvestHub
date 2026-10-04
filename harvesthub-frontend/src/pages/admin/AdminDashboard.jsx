import {
  useEffect,
  useState
} from 'react';

import {
  FiBox,
  FiCreditCard,
  FiStar,
  FiUsers
} from 'react-icons/fi';

import {
  Link
} from 'react-router-dom';

import {
  getAdminDashboard
} from '../../api/adminApi.js';

import {
  getApiErrorMessage
} from '../../api/axiosInstance.js';

import Badge from '../../components/common/Badge.jsx';
import BrandIcon from '../../components/common/BrandIcon.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';

import StatCard from '../../components/admin/StatCard.jsx';

import RatingDistributionChart from '../../components/admin/charts/RatingDistributionChart.jsx';
import RevenueChart from '../../components/admin/charts/RevenueChart.jsx';
import GrowthChart from '../../components/admin/charts/GrowthChart.jsx';

import useToast from '../../hooks/useToast.js';

import {
  formatCurrency
} from '../../utils/formatCurrency.js';

import {
  formatDate
} from '../../utils/formatDate.js';

const AdminDashboard = () => {
  const {
    error
  } = useToast();

  const [
    data,
    setData
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const response =
          await getAdminDashboard();

        if (active) {
          setData(
            response?.data || {}
          );
        }
      } catch (requestError) {
        console.error(
          'ADMIN DASHBOARD ERROR:',
          requestError
        );

        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load admin dashboard'
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
  }, [error]);

  if (loading) {
    return (
      <Loader
        label="Loading admin dashboard..."
      />
    );
  }

  const counts = data?.counts || {};
  const revenue = data?.revenue || {};
  const charts = data?.charts || {};
  const queues = data?.queues || {};

  const recentFarmers =
    Array.isArray(queues.recentFarmers)
      ? queues.recentFarmers
      : [];

  const recentProducts =
    Array.isArray(queues.recentProducts)
      ? queues.recentProducts
      : [];

  const recentPayments =
    Array.isArray(queues.recentPayments)
      ? queues.recentPayments
      : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <BrandIcon
          size="lg"
          rounded={false}
          className="rounded-2xl bg-white/70 p-2 shadow-md"
        />

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
            Dashboard
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Monitor marketplace activity and review pending actions.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total farmers"
          value={counts.farmers || 0}
          icon={FiUsers}
        />

        <StatCard
          label="Pending farmers"
          value={counts.pendingFarmers || 0}
          icon={FiUsers}
          tone="gold"
        />

        <StatCard
          label="Total products"
          value={counts.products || 0}
          icon={FiBox}
        />

        <StatCard
          label="Pending products"
          value={counts.pendingProducts || 0}
          icon={FiBox}
          tone="gold"
        />

        <StatCard
          label="Verified revenue"
          value={formatCurrency(
            revenue.total || 0
          )}
          icon={FiCreditCard}
          tone="gold"
        />

        <StatCard
          label="Pending payments"
          value={counts.pendingPayments || 0}
          icon={FiCreditCard}
          tone="danger"
        />

        <StatCard
          label="Reviews"
          value={counts.reviews || 0}
          icon={FiStar}
        />

        <StatCard
          label="Flagged farmers"
          value={counts.flaggedFarmers || 0}
          icon={FiUsers}
          tone="danger"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-[var(--green-900)]">
              Listing-fee revenue
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Verified payments over time.
            </p>
          </div>

          <RevenueChart
            data={revenue.monthly || []}
          />
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-[var(--green-900)]">
              Farmer growth
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              New farmer registrations by month.
            </p>
          </div>

          <GrowthChart
            data={charts.monthlyGrowth || []}
          />
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-[var(--green-900)]">
              Rating distribution
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Visible and flagged review ratings.
            </p>
          </div>

          <RatingDistributionChart
            data={charts.ratingDistribution || []}
          />
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--green-900)]">
                Pending farmer approvals
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Review these accounts next.
              </p>
            </div>

            <Link
              to="/admin/farmers"
              className="text-sm font-extrabold text-[var(--green-700)] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 divide-y divide-[var(--green-100)]">
            {recentFarmers.length ? (
              recentFarmers.map((farmer) => (
                <Link
                  key={farmer._id}
                  to={`/admin/farmers/${farmer._id}`}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-bold text-[var(--green-900)]">
                      {farmer.farmName ||
                        farmer.user?.name ||
                        'Unnamed farmer'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {farmer.user?.email ||
                        'No email available'}
                    </p>
                  </div>

                  <Badge
                    status={farmer.status}
                  />
                </Link>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-[var(--muted)]">
                No farmer records yet.
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--green-900)]">
                Product approval queue
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Listings waiting for review.
              </p>
            </div>

            <Link
              to="/admin/products"
              className="text-sm font-extrabold text-[var(--green-700)] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 divide-y divide-[var(--green-100)]">
            {recentProducts.length ? (
              recentProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-bold text-[var(--green-900)]">
                      {product.name ||
                        'Unnamed product'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {product.farmer?.farmName ||
                        'Unknown farmer'}
                    </p>
                  </div>

                  <Badge
                    status={product.status}
                  />
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-[var(--muted)]">
                No product approvals pending.
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--green-900)]">
                Payment verification queue
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Check uploaded receipts.
              </p>
            </div>

            <Link
              to="/admin/payments"
              className="text-sm font-extrabold text-[var(--green-700)] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 divide-y divide-[var(--green-100)]">
            {recentPayments.length ? (
              recentPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-bold text-[var(--green-900)]">
                      {payment.product?.name ||
                        'Listing payment'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {payment.farmer?.farmName ||
                        'Unknown farmer'}
                      {' · '}
                      {payment.createdAt
                        ? formatDate(
                            payment.createdAt
                          )
                        : 'No date'}
                    </p>
                  </div>

                  <Badge
                    status={payment.status}
                  />
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-[var(--muted)]">
                No payments pending.
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminDashboard;