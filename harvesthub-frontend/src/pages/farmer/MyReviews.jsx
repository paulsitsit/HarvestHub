import { useEffect, useState } from 'react';
import {
  getFarmerReviews
} from '../../api/farmerApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import ReviewList from '../../components/review/ReviewList.jsx';
import RatingBreakdown from '../../components/review/RatingBreakdown.jsx';
import useToast from '../../hooks/useToast.js';

const MyReviews = () => {
  const { error } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      try {
        const response =
          await getFarmerReviews({
            limit: 100
          });

        if (active) {
          setData(response.data);
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load reviews'
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      active = false;
    };
  }, [error]);

  if (loading) {
    return (
      <Loader label="Loading your reviews..." />
    );
  }

  const farmer = data?.farmer || {};
  const reviews = data?.reviews || [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          Customer feedback
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
          My reviews
        </h1>
      </div>

      <RatingBreakdown
        average={farmer.avgRating}
        count={farmer.reviewCount}
      />

      {reviews.length ? (
        <ReviewList
          reviews={reviews}
          title="Reviews from buyers"
        />
      ) : (
        <EmptyState
          title="No reviews yet"
          description="Reviews from buyers will appear here after they share their experience."
        />
      )}
    </div>
  );
};

export default MyReviews;