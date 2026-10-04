import mongoose from 'mongoose';
import Review from '../models/Review.js';
import FarmerProfile from '../models/FarmerProfile.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { REVIEW_STATUSES } from '../config/constants.js';

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const getFarmerReviews = asyncHandler(async (req, res) => {
  const farmerProfile = await FarmerProfile.findOne({
    user: req.user._id
  }).select('_id farmName avgRating reviewCount');

  if (!farmerProfile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  const {
    status,
    rating,
    page = 1,
    limit = 20
  } = req.query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const filter = {
    farmer: farmerProfile._id
  };

  if (status) {
    filter.status = status;
  }

  if (rating) {
    filter.rating = Number(rating);
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Review.countDocuments(filter)
  ]);

  return successResponse(res, {
    farmer: farmerProfile,
    reviews,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});