import mongoose from 'mongoose';
import FarmerProfile from '../models/FarmerProfile.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  LISTING_FEE,
  PAYMENT_STATUSES
} from '../config/constants.js';
import { createPendingPayment } from '../services/paymentService.js';

const getFilePath = (file) => {
  if (!file) {
    return '';
  }

  return `/${file.path.replace(/\\/g, '/')}`;
};

export const getFarmerPayments = asyncHandler(async (req, res) => {
  const farmerProfile = await FarmerProfile.findOne({
    user: req.user._id
  }).select('_id');

  if (!farmerProfile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  const {
    product,
    status,
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

  if (product && mongoose.Types.ObjectId.isValid(product)) {
    filter.product = product;
  }

  if (status) {
    filter.status = status;
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('product', 'name images status feePaidUntil')
      .populate('farmer', 'farmName')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Payment.countDocuments(filter)
  ]);

  const products = await Product.find({
    farmer: farmerProfile._id
  })
    .select(
      'name status feePaidUntil price unit images createdAt'
    )
    .sort({ createdAt: -1 })
    .lean();

  return successResponse(res, {
    listingFee: LISTING_FEE,
    listingDays: Number(process.env.LISTING_DAYS || 30),
    products,
    payments,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});

export const submitPaymentProof = asyncHandler(async (req, res) => {
  const farmerProfile = await FarmerProfile.findOne({
    user: req.user._id
  }).select('_id');

  if (!farmerProfile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  const {
    productId,
    referenceNumber,
    method = 'gcash'
  } = req.body;

  const proofImage = getFilePath(req.file);

  if (!proofImage) {
    return res.status(422).json({
      success: false,
      message: 'Payment proof image is required'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  if (
    !['gcash', 'bank_transfer', 'cash', 'other'].includes(method)
  ) {
    return res.status(422).json({
      success: false,
      message: 'Invalid payment method'
    });
  }

  if (!referenceNumber?.trim()) {
    return res.status(422).json({
      success: false,
      message: 'Payment reference number is required'
    });
  }

  const payment = await createPendingPayment({
    farmerId: farmerProfile._id,
    productId,
    referenceNumber: referenceNumber.trim(),
    method,
    proofImage
  });

  return successResponse(
    res,
    payment,
    'Payment proof submitted for admin verification',
    201
  );
});