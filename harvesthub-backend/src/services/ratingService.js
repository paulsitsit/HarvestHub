import FarmerProfile from '../models/FarmerProfile.js';
import Review from '../models/Review.js';

export const recomputeFarmerRating = async (farmerId) => {
  const result = await Review.aggregate([
    {
      $match: {
        farmer: farmerId,
        status: 'visible'
      }
    },
    {
      $group: {
        _id: '$farmer',
        averageRating: {
          $avg: '$rating'
        },
        reviewCount: {
          $sum: 1
        }
      }
    }
  ]);

  const ratingData = result[0] || {
    averageRating: 0,
    reviewCount: 0
  };

  await FarmerProfile.findByIdAndUpdate(
    farmerId,
    {
      avgRating: Number(ratingData.averageRating.toFixed(2)),
      reviewCount: ratingData.reviewCount
    },
    {
      runValidators: true
    }
  );

  return ratingData;
};