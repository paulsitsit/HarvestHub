import EmptyState from '../common/EmptyState.jsx';
import ReviewItem from './ReviewItem.jsx';

const ReviewList = ({
  reviews = [],
  title = 'Reviews'
}) => {
  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6">
      <h2 className="text-xl font-extrabold text-[var(--green-900)]">
        {title}
      </h2>

      {!reviews.length ? (
        <div className="mt-5">
          <EmptyState
            title="No reviews yet"
            description="Be the first buyer to share your experience."
          />
        </div>
      ) : (
        <div className="mt-3">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewList;