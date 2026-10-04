import FarmerProfile from '../models/FarmerProfile.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  FARMER_STATUSES,
  PAYMENT_STATUSES,
  PRODUCT_STATUSES,
  REVIEW_STATUSES
} from '../config/constants.js';

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    farmerCount,
    pendingFarmerCount,
    approvedFarmerCount,
    productCount,
    pendingProductCount,
    approvedProductCount,
    paymentRevenue,
    pendingPaymentCount,
    reviewCount,
    flaggedReviewCount,
    flaggedFarmerCount,
    recentFarmers,
    recentProducts,
    recentPayments,
    ratingDistribution,
    monthlyRevenue,
    monthlyGrowth
  ] = await Promise.all([
    FarmerProfile.countDocuments({}),

    FarmerProfile.countDocuments({
      status: FARMER_STATUSES.PENDING
    }),

    FarmerProfile.countDocuments({
      status: FARMER_STATUSES.APPROVED
    }),

    Product.countDocuments({}),

    Product.countDocuments({
      status: PRODUCT_STATUSES.PENDING
    }),

    Product.countDocuments({
      status: PRODUCT_STATUSES.APPROVED
    }),

    Payment.aggregate([
      {
        $match: {
          status: PAYMENT_STATUSES.VERIFIED
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount'
          }
        }
      }
    ]),

    Payment.countDocuments({
      status: PAYMENT_STATUSES.PENDING
    }),

    Review.countDocuments({}),

    Review.countDocuments({
      status: REVIEW_STATUSES.FLAGGED
    }),

    FarmerProfile.countDocuments({
      isFlaggedFraud: true
    }),

    FarmerProfile.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Product.find({
      status: PRODUCT_STATUSES.PENDING
    })
      .populate('category', 'name')
      .populate('farmer', 'farmName municipality')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Payment.find({
      status: PAYMENT_STATUSES.PENDING
    })
      .populate('farmer', 'farmName')
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

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

    Payment.aggregate([
      {
        $match: {
          status: PAYMENT_STATUSES.VERIFIED
        }
      },
      {
        $group: {
          _id: {
            year: {
              $year: '$verifiedAt'
            },
            month: {
              $month: '$verifiedAt'
            }
          },
          revenue: {
            $sum: '$amount'
          },
          payments: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]),

    FarmerProfile.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: '$createdAt'
            },
            month: {
              $month: '$createdAt'
            }
          },
          farmers: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ])
  ]);

  const recentActivity = await ActivityLog.find({})
    .populate('actor', 'name email role')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const adminCount = await User.countDocuments({
    role: 'admin'
  });

  return successResponse(res, {
    counts: {
      farmers: farmerCount,
      pendingFarmers: pendingFarmerCount,
      approvedFarmers: approvedFarmerCount,
      products: productCount,
      pendingProducts: pendingProductCount,
      approvedProducts: approvedProductCount,
      pendingPayments: pendingPaymentCount,
      reviews: reviewCount,
      flaggedReviews: flaggedReviewCount,
      flaggedFarmers: flaggedFarmerCount,
      admins: adminCount
    },
    revenue: {
      total: paymentRevenue[0]?.total || 0,
      monthly: monthlyRevenue
    },
    charts: {
      ratingDistribution,
      monthlyGrowth
    },
    queues: {
      recentFarmers,
      recentProducts,
      recentPayments
    },
    recentActivity
  });
});