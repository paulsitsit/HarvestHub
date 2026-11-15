import mongoose from 'mongoose';
import Product from '../models/Product.js';
import FarmerProfile from '../models/FarmerProfile.js';
import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  FARMER_STATUSES,
  PRODUCT_STATUSES
} from '../config/constants.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\const isValidObjectId = (id) => {');

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

const publicProductProjection = {
  name: 1,
  price: 1,
  unit: 1,
  quantity: 1,
  availability: 1,
  description: 1,
  images: 1,
  harvestDate: 1,
  status: 1,
  rejectionReason: 1,
  feePaidUntil: 1,
  views: 1,
  createdAt: 1,
  updatedAt: 1
};

export const getAdminProducts = asyncHandler(async (req, res) => {
  const {
    status,
    search = '',
    farmer,
    category,
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

  if (farmer && isValidObjectId(farmer)) {
    filter.farmer = farmer;
  }

  if (category && isValidObjectId(category)) {
    filter.category = category;
  }

  if (search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex }
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select(publicProductProjection)
      .populate('category', 'name slug icon')
      .populate({
        path: 'farmer',
        select:
          'farmName municipality province status isFlaggedFraud avgRating reviewCount',
        populate: {
          path: 'user',
          select: 'name email phone isActive'
        }
      })
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

export const getAdminProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  const product = await Product.findById(id)
    .populate('category', 'name slug icon')
    .populate({
      path: 'farmer',
      populate: {
        path: 'user',
        select: 'name email phone isActive'
      }
    })
    .lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  return successResponse(res, product);
});

export const approveProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate('farmer');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const farmer = await FarmerProfile.findById(product.farmer._id);

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Product farmer profile not found'
    });
  }

  if (farmer.status !== FARMER_STATUSES.APPROVED) {
    return res.status(400).json({
      success: false,
      message: 'The farmer must be approved before approving products'
    });
  }

  if (farmer.isFlaggedFraud) {
    return res.status(400).json({
      success: false,
      message: 'Products from fraud-flagged farmers cannot be approved'
    });
  }

  product.status = PRODUCT_STATUSES.APPROVED;
  product.rejectionReason = '';

  await product.save();

  await writeActivityLog({
    actor: req.user._id,
    action: 'approve_product',
    targetType: 'Product',
    targetId: product._id,
    note: 'Product listing approved'
  });

  const updatedProduct = await Product.findById(product._id)
    .populate('category', 'name slug icon')
    .populate('farmer', 'farmName municipality province status');

  return successResponse(
    res,
    updatedProduct,
    'Product approved successfully'
  );
});

export const rejectProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason = '' } = req.body;

  if (!rejectionReason.trim()) {
    return res.status(422).json({
      success: false,
      message: 'Rejection reason is required'
    });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product.status = PRODUCT_STATUSES.REJECTED;
  product.rejectionReason = rejectionReason.trim();

  await product.save();

  await writeActivityLog({
    actor: req.user._id,
    action: 'reject_product',
    targetType: 'Product',
    targetId: product._id,
    note: rejectionReason.trim()
  });

  return successResponse(
    res,
    product,
    'Product rejected successfully'
  );
});

export const expireProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product.status = PRODUCT_STATUSES.EXPIRED;
  await product.save();

  await writeActivityLog({
    actor: req.user._id,
    action: 'expire_product',
    targetType: 'Product',
    targetId: product._id,
    note: 'Product manually expired by admin'
  });

  return successResponse(
    res,
    product,
    'Product expired successfully'
  );
});

export const removeProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product.status = PRODUCT_STATUSES.REMOVED;
  product.rejectionReason = 'Removed by administrator';

  await product.save();

  await writeActivityLog({
    actor: req.user._id,
    action: 'remove_product',
    targetType: 'Product',
    targetId: product._id,
    note: 'Product removed by admin'
  });

  return successResponse(
    res,
    null,
    'Product removed successfully'
  );
});