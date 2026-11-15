import mongoose from 'mongoose';
import Review from '../models/Review.js';
import FarmerProfile from '../models/FarmerProfile.js';
import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  REVIEW_STATUSES,
  FARMER_STATUSES
} from '../config/constants.js';
import { recomputeFarmerRating } from '../services/ratingService.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const writeActivityLog = async ({
  actor,
  action,
  targetType,
  targetId,
  note = ''
}) => {
  await ActivityLog.create({
    actor,
    action,
    targetType,
    targetId,
    note
  });
};

export const getAdminReviews = asyncHandler(async (req, res) => {
  const {
    status,
    rating,
    farmer,
    search = '',
    page = 1,
    limit = 20
  } = req.query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (rating) {
    filter.rating = Number(rating);
  }

  if (farmer && isValidObjectId(farmer)) {
    filter.farmer = farmer;
  }

  if (search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [
      { buyerName: searchRegex },
      { comment: searchRegex }
    ];
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate({
        path: 'farmer',
        select:
          'farmName municipality province avgRating reviewCount status'
      })
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Review.countDocuments(filter)
  ]);

  return successResponse(res, {
    reviews,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});

export const getAdminReviewStats = asyncHandler(async (req, res) => {
  const [
    ratingDistribution,
    statusDistribution,
    farmerRatings,
    lowestRatedFarmers,
    totals
  ] = await Promise.all([
    Review.aggregate([
      {
        $match: {
          status: {
            $in: [
              REVIEW_STATUSES.VISIBLE,
              REVIEW_STATUSES.FLAGGED
            ]
          }
        }
      },
      {
        $group: {
          _id: '$rating',
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]),

    Review.aggregate([
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]),

    Review.aggregate([
      {
        $match: {
          status: REVIEW_STATUSES.VISIBLE
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
      },
      {
        $sort: {
          averageRating: -1,
          reviewCount: -1
        }
      }
    ]),

    Review.aggregate([
      {
        $match: {
          status: REVIEW_STATUSES.VISIBLE
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
      },
      {
        $match: {
          reviewCount: {
            $gte: 1
          }
        }
      },
      {
        $sort: {
          averageRating: 1,
          reviewCount: -1
        }
      },
      {
        $limit: 10
      }
    ]),

    Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: {
            $sum: 1
          },
          averageRating: {
            $avg: '$rating'
          },
          visibleReviews: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    '$status',
                    REVIEW_STATUSES.VISIBLE
                  ]
                },
                1,
                0
              ]
            }
          },
          flaggedReviews: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    '$status',
                    REVIEW_STATUSES.FLAGGED
                  ]
                },
                1,
                0
              ]
            }
          },
          hiddenReviews: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    '$status',
                    REVIEW_STATUSES.HIDDEN
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ])
  ]);

  const farmerIds = [
    ...new Set([
      ...farmerRatings.map((item) => item._id.toString()),
      ...lowestRatedFarmers.map((item) =>
        item._id.toString()
      )
    ])
  ];

  const farmers = await FarmerProfile.find({
    _id: {
      $in: farmerIds
    }
  })
    .select(
      'farmName municipality province avgRating reviewCount status'
    )
    .lean();

  const farmerMap = new Map(
    farmers.map((farmer) => [
      farmer._id.toString(),
      farmer
    ])
  );

  const addFarmerDetails = (item) => ({
    ...item,
    farmer: farmerMap.get(item._id.toString()) || null
  });

  return successResponse(res, {
    totals: totals[0] || {
      totalReviews: 0,
      averageRating: 0,
      visibleReviews: 0,
      flaggedReviews: 0,
      hiddenReviews: 0
    },
    ratingDistribution,
    statusDistribution,
    farmerRatings: farmerRatings.map(addFarmerDetails),
    lowestRatedFarmers:
      lowestRatedFarmers.map(addFarmerDetails)
  });
});

const changeReviewStatus = async ({
  reviewId,
  status,
  adminId,
  action,
  note
}) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  review.status = status;
  await review.save();

  await recomputeFarmerRating(review.farmer);

  await writeActivityLog({
    actor: adminId,
    action,
    targetType: 'Review',
    targetId: review._id,
    note
  });

  return Review.findById(review._id)
    .populate(
      'farmer',
      'farmName avgRating reviewCount status'
    );
};

export const hideReview = asyncHandler(async (req, res) => {
  const review = await changeReviewStatus({
    reviewId: req.params.id,
    status: REVIEW_STATUSES.HIDDEN,
    adminId: req.user._id,
    action: 'hide_review',
    note: 'Review hidden by administrator'
  });

  return successResponse(
    res,
    review,
    'Review hidden successfully'
  );
});

export const flagReview = asyncHandler(async (req, res) => {
  const { reason = '' } = req.body;

  const review = await changeReviewStatus({
    reviewId: req.params.id,
    status: REVIEW_STATUSES.FLAGGED,
    adminId: req.user._id,
    action: 'flag_review',
    note: reason.trim() || 'Review flagged by administrator'
  });

  return successResponse(
    res,
    review,
    'Review flagged successfully'
  );
});

export const restoreReview = asyncHandler(async (req, res) => {
  const review = await changeReviewStatus({
    reviewId: req.params.id,
    status: REVIEW_STATUSES.VISIBLE,
    adminId: req.user._id,
    action: 'restore_review',
    note: 'Review restored by administrator'
  });

  return successResponse(
    res,
    review,
    'Review restored successfully'
  );
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  const farmerId = review.farmer;

  await Review.findByIdAndDelete(review._id);
  await recomputeFarmerRating(farmerId);

  await writeActivityLog({
    actor: req.user._id,
    action: 'delete_review',
    targetType: 'Review',
    targetId: review._id,
    note: 'Review permanently deleted by administrator'
  });

  return successResponse(
    res,
    null,
    'Review deleted successfully'
  );
});