import mongoose from 'mongoose';
import Product from '../models/Product.js';
import FarmerProfile from '../models/FarmerProfile.js';
import Category from '../models/Category.js';
import Inquiry from '../models/Inquiry.js';
import Review from '../models/Review.js';
import {
  PRODUCT_STATUSES,
  FARMER_STATUSES,
  REVIEW_STATUSES
} from '../config/constants.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { recomputeFarmerRating } from '../services/ratingService.js';

const publicProductFilter = () => ({
  status: PRODUCT_STATUSES.APPROVED,
  feePaidUntil: {
    $gt: new Date()
  }
});

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const toPositiveInteger = (value, fallback, maximum) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, maximum);
};

const addFarmerVisibilityFilter = (filter) => {
  return {
    ...filter,
    farmer: {
      $exists: true
    }
  };
};

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
    .sort({ name: 1 })
    .lean();

  return successResponse(res, categories);
});

export const getPublicProducts = asyncHandler(async (req, res) => {
  const {
    search = '',
    category = '',
    minPrice,
    maxPrice,
    municipality = '',
    minRating,
    availability = '',
    sort = 'newest',
    page = 1,
    limit = 12
  } = req.query;

  const currentPage = toPositiveInteger(page, 1, 100000);
  const pageLimit = toPositiveInteger(limit, 12, 48);

  const filter = publicProductFilter();

  if (search.trim()) {
    filter.$text = {
      $search: search.trim()
    };
  }

  if (category.trim()) {
    if (validateObjectId(category)) {
      filter.category = category;
    } else {
      const matchingCategory = await Category.findOne({
        slug: category.toLowerCase().trim()
      }).select('_id');

      if (!matchingCategory) {
        return successResponse(res, {
          products: [],
          pagination: {
            page: currentPage,
            limit: pageLimit,
            total: 0,
            pages: 0
          }
        });
      }

      filter.category = matchingCategory._id;
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined && Number.isFinite(Number(minPrice))) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined && Number.isFinite(Number(maxPrice))) {
      filter.price.$lte = Number(maxPrice);
    }

    if (!Object.keys(filter.price).length) {
      delete filter.price;
    }
  }

  if (availability) {
    filter.availability = availability;
  }

  const farmerFilter = {
    status: FARMER_STATUSES.APPROVED,
    isFlaggedFraud: false
  };

  if (municipality.trim()) {
    farmerFilter.municipality = {
      $regex: municipality.trim(),
      $options: 'i'
    };
  }

  if (minRating !== undefined && Number.isFinite(Number(minRating))) {
    farmerFilter.avgRating = {
      $gte: Number(minRating)
    };
  }

  const matchingFarmers = await FarmerProfile.find(farmerFilter)
    .select('_id')
    .lean();

  filter.farmer = {
    $in: matchingFarmers.map((farmer) => farmer._id)
  };

  const sortMap = {
    newest: {
      createdAt: -1
    },
    oldest: {
      createdAt: 1
    },
    price_low: {
      price: 1
    },
    price_high: {
      price: -1
    },
    rating: {
      createdAt: -1
    },
    popular: {
      views: -1,
      createdAt: -1
    }
  };

  const productSort = sortMap[sort] || sortMap.newest;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug icon')
      .populate({
        path: 'farmer',
        select:
          'farmName municipality province profilePhoto avgRating reviewCount contactNumber'
      })
      .sort(productSort)
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Product.countDocuments(filter)
  ]);

  return successResponse(res, {
    products,
    filters: {
      search,
      category,
      minPrice,
      maxPrice,
      municipality,
      minRating,
      availability,
      sort
    },
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});

export const getPublicProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  const product = await Product.findOne({
    _id: id,
    ...publicProductFilter()
  })
    .populate('category', 'name slug icon')
    .populate({
      path: 'farmer',
      select:
        'farmName bio address municipality province contactNumber profilePhoto farmPhotos avgRating reviewCount status'
    })
    .lean();

  if (!product || !product.farmer) {
    return res.status(404).json({
      success: false,
      message: 'Product not found or no longer available'
    });
  }

  await Product.findByIdAndUpdate(id, {
    $inc: {
      views: 1
    }
  });

  const reviews = await Review.find({
    farmer: product.farmer._id,
    status: REVIEW_STATUSES.VISIBLE
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return successResponse(res, {
    product: {
      ...product,
      views: product.views + 1
    },
    reviews
  });
});

export const getPublicFarmerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid farmer ID'
    });
  }

  const farmer = await FarmerProfile.findOne({
    _id: id,
    status: FARMER_STATUSES.APPROVED,
    isFlaggedFraud: false
  })
    .populate('user', 'name')
    .lean();

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  const products = await Product.find({
    farmer: farmer._id,
    ...publicProductFilter()
  })
    .populate('category', 'name slug icon')
    .sort({ createdAt: -1 })
    .lean();

  const reviews = await Review.find({
    farmer: farmer._id,
    status: REVIEW_STATUSES.VISIBLE
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return successResponse(res, {
    farmer,
    products,
    reviews
  });
});

export const getFarmerReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid farmer ID'
    });
  }

  const farmer = await FarmerProfile.findOne({
    _id: id,
    status: FARMER_STATUSES.APPROVED,
    isFlaggedFraud: false
  }).select('_id avgRating reviewCount');

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  const reviews = await Review.find({
    farmer: farmer._id,
    status: REVIEW_STATUSES.VISIBLE
  })
    .sort({ createdAt: -1 })
    .lean();

  return successResponse(res, {
    farmer: {
      avgRating: farmer.avgRating,
      reviewCount: farmer.reviewCount
    },
    reviews
  });
});

export const getFeatured = asyncHandler(async (req, res) => {
  const [products, farmers] = await Promise.all([
    Product.find({
      ...publicProductFilter()
    })
      .populate('category', 'name slug icon')
      .populate({
        path: 'farmer',
        select:
          'farmName municipality province profilePhoto avgRating reviewCount'
      })
      .sort({
        views: -1,
        createdAt: -1
      })
      .limit(8)
      .lean(),

    FarmerProfile.find({
      status: FARMER_STATUSES.APPROVED,
      isFlaggedFraud: false,
      reviewCount: {
        $gt: 0
      }
    })
      .populate('user', 'name')
      .sort({
        avgRating: -1,
        reviewCount: -1
      })
      .limit(6)
      .lean()
  ]);

  return successResponse(res, {
    products,
    farmers
  });
});

export const createInquiry = asyncHandler(async (req, res) => {
  const {
    product,
    buyerName = 'Guest buyer',
    buyerPhone = '',
    quantityWanted,
    message = '',
    type = 'message',
    website = ''
  } = req.body;

  if (website) {
    return successResponse(
      res,
      null,
      'Inquiry received'
    );
  }

  if (!validateObjectId(product)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  if (!['call', 'message'].includes(type)) {
    return res.status(422).json({
      success: false,
      message: 'Inquiry type must be call or message'
    });
  }

  const publicProduct = await Product.findOne({
    _id: product,
    ...publicProductFilter()
  });

  if (!publicProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product is unavailable'
    });
  }

  const farmer = await FarmerProfile.findOne({
    _id: publicProduct.farmer,
    status: FARMER_STATUSES.APPROVED,
    isFlaggedFraud: false
  });

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer is unavailable'
    });
  }

  const inquiry = await Inquiry.create({
    product: publicProduct._id,
    farmer: farmer._id,
    buyerName: buyerName.trim() || 'Guest buyer',
    buyerPhone: buyerPhone.trim(),
    quantityWanted:
      quantityWanted === undefined || quantityWanted === ''
        ? null
        : Number(quantityWanted),
    message: message.trim(),
    type
  });

  const populatedInquiry = await Inquiry.findById(inquiry._id)
    .populate('product', 'name price unit')
    .populate('farmer', 'farmName contactNumber');

  return successResponse(
    res,
    populatedInquiry,
    'Inquiry sent successfully',
    201
  );
});

export const createReview = asyncHandler(async (req, res) => {
  const {
    farmer,
    buyerName,
    rating,
    comment,
    website = ''
  } = req.body;

  if (website) {
    return successResponse(
      res,
      null,
      'Review submitted for moderation'
    );
  }

  if (!validateObjectId(farmer)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid farmer ID'
    });
  }

  const farmerProfile = await FarmerProfile.findOne({
    _id: farmer,
    status: FARMER_STATUSES.APPROVED,
    isFlaggedFraud: false
  });

  if (!farmerProfile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  const review = await Review.create({
    farmer: farmerProfile._id,
    buyerName: buyerName.trim(),
    rating: Number(rating),
    comment: comment.trim(),
    status: REVIEW_STATUSES.VISIBLE
  });

  await recomputeFarmerRating(farmerProfile._id);

  return successResponse(
    res,
    review,
    'Review submitted successfully',
    201
  );
});