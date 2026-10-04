import FarmerProfile from '../models/FarmerProfile.js';
import Product from '../models/Product.js';
import Inquiry from '../models/Inquiry.js';
import Review from '../models/Review.js';
import Payment from '../models/Payment.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  PRODUCT_STATUSES,
  PAYMENT_STATUSES
} from '../config/constants.js';

const getFilePath = (file) => {
  if (!file) {
    return '';
  }

  return `/${file.path.replace(/\\/g, '/')}`;
};

const getFilePaths = (files = []) => {
  return files
    .filter(Boolean)
    .map((file) => getFilePath(file));
};

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const parseImages = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getFarmerProfile = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOne({
    user: req.user._id
  }).populate('user', 'name email phone createdAt');

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  return successResponse(res, profile);
});

export const updateFarmerProfile = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOne({
    user: req.user._id
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  const allowedFields = [
    'farmName',
    'bio',
    'address',
    'municipality',
    'province',
    'contactNumber'
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      profile[field] = String(req.body[field]).trim();
    }
  });

  const files = req.files || {};

  if (files.profilePhoto?.[0]) {
    profile.profilePhoto = getFilePath(files.profilePhoto[0]);
  }

  if (files.farmPhotos?.length) {
    const uploadedFarmPhotos = getFilePaths(files.farmPhotos);

    profile.farmPhotos = [
      ...profile.farmPhotos,
      ...uploadedFarmPhotos
    ].slice(0, 5);
  }

  if (files.validIdImage?.[0]) {
    profile.validIdImage = getFilePath(files.validIdImage[0]);
  }

  await profile.save();

  const updatedProfile = await FarmerProfile.findById(profile._id)
    .populate('user', 'name email phone createdAt');

  return successResponse(
    res,
    updatedProfile,
    'Farmer profile updated successfully'
  );
});

export const getFarmerDashboard = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOne({
    user: req.user._id
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  const [
    activeProducts,
    pendingProducts,
    totalProducts,
    newInquiries,
    totalInquiries,
    pendingPayments,
    recentInquiries
  ] = await Promise.all([
    Product.countDocuments({
      farmer: profile._id,
      status: PRODUCT_STATUSES.APPROVED,
      feePaidUntil: {
        $gt: new Date()
      }
    }),

    Product.countDocuments({
      farmer: profile._id,
      status: PRODUCT_STATUSES.PENDING
    }),

    Product.countDocuments({
      farmer: profile._id
    }),

    Inquiry.countDocuments({
      farmer: profile._id,
      status: 'new'
    }),

    Inquiry.countDocuments({
      farmer: profile._id
    }),

    Payment.countDocuments({
      farmer: profile._id,
      status: PAYMENT_STATUSES.PENDING
    }),

    Inquiry.find({
      farmer: profile._id
    })
      .populate('product', 'name price unit images')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  ]);

  return successResponse(res, {
    profile,
    stats: {
      activeProducts,
      pendingProducts,
      totalProducts,
      newInquiries,
      totalInquiries,
      pendingPayments,
      averageRating: profile.avgRating,
      reviewCount: profile.reviewCount
    },
    recentInquiries
  });
});

export const getFarmerProducts = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOne({
    user: req.user._id
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  const {
    status,
    search = '',
    page = 1,
    limit = 12
  } = req.query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);

  const filter = {
    farmer: profile._id
  };

  if (status) {
    filter.status = status;
  }

  if (search.trim()) {
    filter.$text = {
      $search: search.trim()
    };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Product.countDocuments(filter)
  ]);

  return successResponse(res, {
    products,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const profile = req.farmerProfile;

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Approved farmer profile not found'
    });
  }

  const {
    name,
    category,
    price,
    unit,
    quantity,
    availability,
    description,
    harvestDate
  } = req.body;

  const images = getFilePaths(req.files || []);

  if (!images.length) {
    return res.status(422).json({
      success: false,
      message: 'At least one product image is required'
    });
  }

  const product = await Product.create({
    farmer: profile._id,
    name: name.trim(),
    category,
    price: Number(price),
    unit,
    quantity: Number(quantity),
    availability: availability || 'available',
    description: description?.trim() || '',
    images,
    harvestDate: harvestDate || null,
    status: PRODUCT_STATUSES.PENDING
  });

  const populatedProduct = await Product.findById(product._id)
    .populate('category', 'name slug icon')
    .populate({
      path: 'farmer',
      select: 'farmName municipality province avgRating reviewCount'
    });

  return successResponse(
    res,
    populatedProduct,
    'Product submitted for admin approval',
    201
  );
});

export const updateProduct = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOne({
    user: req.user._id
  });

  const product = await Product.findOne({
    _id: req.params.id,
    farmer: profile?._id
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const editableFields = [
    'name',
    'category',
    'price',
    'unit',
    'quantity',
    'availability',
    'description',
    'harvestDate'
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  if (req.body.price !== undefined) {
    product.price = Number(req.body.price);
  }

  if (req.body.quantity !== undefined) {
    product.quantity = Number(req.body.quantity);
  }

  if (req.body.harvestDate === '') {
    product.harvestDate = null;
  }

  const uploadedImages = getFilePaths(req.files || []);
  const retainedImages = parseImages(req.body.existingImages);

  if (uploadedImages.length || retainedImages.length) {
    product.images = [
      ...retainedImages,
      ...uploadedImages
    ].slice(0, 5);
  }

  product.status = PRODUCT_STATUSES.PENDING;
  product.rejectionReason = '';

  await product.save();

  const updatedProduct = await Product.findById(product._id)
    .populate('category', 'name slug icon')
    .populate({
      path: 'farmer',
      select: 'farmName municipality province avgRating reviewCount'
    });

  return successResponse(
    res,
    updatedProduct,
    'Product updated and resubmitted for approval'
  );
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOne({
    user: req.user._id
  });

  const product = await Product.findOne({
    _id: req.params.id,
    farmer: profile?._id
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product.status = PRODUCT_STATUSES.REMOVED;
  await product.save();

  return successResponse(
    res,
    null,
    'Product removed successfully'
  );
});

export const updateProductAvailability = asyncHandler(
  async (req, res) => {
    const profile = await FarmerProfile.findOne({
      user: req.user._id
    });

    const product = await Product.findOne({
      _id: req.params.id,
      farmer: profile?._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { availability, quantity } = req.body;

    if (availability !== undefined) {
      product.availability = availability;
    }

    if (quantity !== undefined) {
      const parsedQuantity = Number(quantity);

      if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
        return res.status(422).json({
          success: false,
          message: 'Quantity must be a non-negative number'
        });
      }

      product.quantity = parsedQuantity;
    }

    await product.save();

    return successResponse(
      res,
      product,
      'Product availability updated successfully'
    );
  }
);