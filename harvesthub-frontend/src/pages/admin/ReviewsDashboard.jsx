import { useEffect, useState } from 'react';
import {
  deleteReview,
  flagReview,
  getAdminReviewStats,
  getAdminReviews,
  hideReview,
  restoreReview
} from '../../api/adminApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import ReviewModerationTable from '../../components/admin/ReviewModerationTable.jsx';
import RatingDistributionChart from '../../components/admin/charts/RatingDistributionChart.jsx';
import useToast from '../../hooks/useToast.js';

const ReviewsDashboard = () => {
  const { success, error } = useToast();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    rating: ''
  });

  const [flagTarget, setFlagTarget] =
    useState(null);
  const [deleteTarget, setDeleteTarget] =
    useState(null);
  const [reason, setReason] = useState('');

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        reviewsResponse,
        statsResponse
      ] = await Promise.all([
        getAdminReviews({
          search: filters.search,
          status: filters.status || undefined,
          rating: filters.rating || undefined,
          limit: 100
        }),
        getAdminReviewStats()
      ]);

      setReviews(
        reviewsResponse.data.reviews || []
      );

      setStats(statsResponse.data || null);
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to load review dashboard'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [
    filters.search,
    filters.status,
    filters.rating
  ]);

  const runReviewAction = async (
    review,
    callback,
    message
  ) => {
    setLoadingId(review._id);

    try {
      await callback();
      success(message);
      await loadData();
    } catch (requestError) {
      error(
        getApiErrorMessage(
          requestError,
          'Unable to moderate review'
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleFlag = (review) => {
    setReason('');
    setFlagTarget(review);
  };

  const confirmFlag = async () => {
    if (!flagTarget) {
      return;
    }

    await runReviewAction(
      flagTarget,
      () =>
        flagReview(
          flagTarget._id,
          reason.trim()
        ),
      'Review flagged.'
    );

    setFlagTarget(null);
    setReason('');
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    await runReviewAction(
      deleteTarget,
      () => deleteReview(deleteTarget._id),
      'Review deleted.'
    );

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Moderation
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          Reviews dashboard
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GlassCard className="p-5">
          <p className="text-sm text-[var(--muted)]">
            Total reviews
          </p>

          <p className="mt-2 text-3xl font-extrabold text-[var(--green-900)]">
            {stats?.totals?.totalReviews || 0}
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-sm text-[var(--muted)]">
            Average rating
          </p>

          <p className="mt-2 text-3xl font-extrabold text-[var(--green-900)]">
            {Number(
              stats?.totals?.averageRating || 0
            ).toFixed(1)}
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-sm text-[var(--muted)]">
            Flagged reviews
          </p>

          <p className="mt-2 text-3xl font-extrabold text-red-700">
            {stats?.totals?.flaggedReviews || 0}
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-sm text-[var(--muted)]">
            Hidden reviews
          </p>

          <p className="mt-2 text-3xl font-extrabold text-[var(--gold-600)]">
            {stats?.totals?.hiddenReviews || 0}
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-5 sm:p-6">
          <h2 className="text-xl font-extrabold text-[var(--green-900)]">
            Rating distribution
          </h2>

          <div className="mt-4">
            <RatingDistributionChart
              data={stats?.ratingDistribution || []}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <h2 className="text-xl font-extrabold text-[var(--green-900)]">
            Lowest-rated farmers
          </h2>

          <div className="mt-4 divide-y divide-[var(--green-100)]">
            {(stats?.lowestRatedFarmers || []).length ? (
              stats.lowestRatedFarmers.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-bold text-[var(--green-900)]">
                      {item.farmer?.farmName || 'Unknown farmer'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {item.reviewCount} review
                      {item.reviewCount === 1 ? '' : 's'}
                    </p>
                  </div>

                  <p className="font-extrabold text-red-700">
                    {Number(
                      item.averageRating || 0
                    ).toFixed(1)}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-8 text-sm text-[var(--muted)]">
                No farmer ratings available.
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="glass-panel grid gap-4 rounded-2xl p-5 md:grid-cols-[1fr_180px_180px_auto] md:items-end">
        <Input
          label="Search"
          placeholder="Buyer name or comment..."
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              search: event.target.value
            }))
          }
        />

        <Select
          label="Status"
          value={filters.status}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              status: event.target.value
            }))
          }
        >
          <option value="">All statuses</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="flagged">Flagged</option>
        </Select>

        <Select
          label="Rating"
          value={filters.rating}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              rating: event.target.value
            }))
          }
        >
          <option value="">All ratings</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </Select>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              search: '',
              status: '',
              rating: ''
            })
          }
        >
          Reset
        </Button>
      </div>

      {loading ? (
        <Loader label="Loading reviews..." />
      ) : (
        <ReviewModerationTable
          reviews={reviews}
          onHide={(review) =>
            runReviewAction(
              review,
              () => hideReview(review._id),
              'Review hidden.'
            )
          }
          onFlag={handleFlag}
          onRestore={(review) =>
            runReviewAction(
              review,
              () => restoreReview(review._id),
              'Review restored.'
            )
          }
          onDelete={setDeleteTarget}
          loadingId={loadingId}
        />
      )}

      <Modal
        open={Boolean(flagTarget)}
        onClose={() => setFlagTarget(null)}
        title="Flag review"
        size="sm"
      >
        <p className="text-sm leading-7 text-[var(--muted)]">
          {flagTarget?.comment}
        </p>

        <div className="mt-5">
          <label
            htmlFor="review-flag-reason"
            className="block text-sm font-bold text-[var(--green-900)]"
          >
            Reason
          </label>

          <textarea
            id="review-flag-reason"
            rows={5}
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            className="glass-input mt-2 resize-y px-4 py-3"
            placeholder="Explain why this review is being flagged..."
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setFlagTarget(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={confirmFlag}
          >
            Flag review
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete review?"
        message="This permanently deletes the review and recalculates the farmer rating."
        confirmText="Delete review"
        danger
        loading={loadingId === deleteTarget?._id}
      />
    </div>
  );
};

export default ReviewsDashboard;