import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import FarmerProfile from '../models/FarmerProfile.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  PAYMENT_STATUSES
} from '../config/constants.js';
import {
  verifyPaymentAndActivateProduct,
  rejectPayment
} from '../services/paymentService.js';

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

export const getAdminPayments = asyncHandler(async (req, res) => {
  const {
    status,
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

  const searchTerm = String(search).trim();

  if (searchTerm) {
    const searchRegex = new RegExp(escapeRegex(searchTerm), 'i');

    // Resolve related names before pagination. Searching populated fields
    // after skip/limit only searched the current page and returned wrong totals.
    const [users, farmers, products] = await Promise.all([
      User.find({ name: searchRegex }).select('_id').lean(),
      FarmerProfile.find({ farmName: searchRegex }).select('_id').lean(),
      Product.find({ name: searchRegex }).select('_id').lean()
    ]);

    const farmerIds = new Set(farmers.map((farmer) => String(farmer._id)));

    if (users.length) {
      const profiles = await FarmerProfile.find({
        user: { $in: users.map((user) => user._id) }
      }).select('_id').lean();

      profiles.forEach((profile) => farmerIds.add(String(profile._id)));
    }

    const searchConditions = [
      { referenceNumber: searchRegex }
    ];

    if (farmerIds.size) {
      searchConditions.push({
        farmer: { $in: [...farmerIds].map((id) => new mongoose.Types.ObjectId(id)) }
      });
    }

    if (products.length) {
      searchConditions.push({
        product: { $in: products.map((product) => product._id) }
      });
    }

    filter.$or = searchConditions;
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate({
        path: 'farmer',
        select:
          'farmName municipality province status profilePhoto',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate(
        'product',
        'name price unit status feePaidUntil images'
      )
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Payment.countDocuments(filter)
  ]);

  return successResponse(res, {
    payments,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});

export const getAdminPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment ID'
    });
  }

  const payment = await Payment.findById(id)
    .populate({
      path: 'farmer',
      populate: {
        path: 'user',
        select: 'name email phone'
      }
    })
    .populate(
      'product',
      'name price unit status feePaidUntil images'
    )
    .populate('verifiedBy', 'name email')
    .lean();

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  return successResponse(res, payment);
});

export const verifyAdminPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment ID'
    });
  }

  const result = await verifyPaymentAndActivateProduct({
    paymentId: id,
    adminId: req.user._id
  });

  await writeActivityLog({
    actor: req.user._id,
    action: 'verify_payment',
    targetType: 'Payment',
    targetId: result.payment._id,
    note: `Verified payment for product ${result.product.name}`
  });

  const payment = await Payment.findById(
    result.payment._id
  )
    .populate('product', 'name status feePaidUntil')
    .populate('farmer', 'farmName municipality province')
    .populate('verifiedBy', 'name email');

  return successResponse(
    res,
    {
      payment,
      product: result.product
    },
    'Payment verified and product activated successfully'
  );
});

export const rejectAdminPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason = '' } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment ID'
    });
  }

  if (!rejectionReason.trim()) {
    return res.status(422).json({
      success: false,
      message: 'Rejection reason is required'
    });
  }

  const payment = await rejectPayment({
    paymentId: id,
    adminId: req.user._id,
    rejectionReason: rejectionReason.trim()
  });

  await writeActivityLog({
    actor: req.user._id,
    action: 'reject_payment',
    targetType: 'Payment',
    targetId: payment._id,
    note: rejectionReason.trim()
  });

  const updatedPayment = await Payment.findById(payment._id)
    .populate('product', 'name status feePaidUntil')
    .populate('farmer', 'farmName municipality province')
    .populate('verifiedBy', 'name email');

  return successResponse(
    res,
    updatedPayment,
    'Payment rejected successfully'
  );
});
