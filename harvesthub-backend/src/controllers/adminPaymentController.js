import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
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

  let filteredPayments = payments;

  if (search.trim()) {
    const searchTerm = search.trim().toLowerCase();

    filteredPayments = payments.filter((payment) => {
      const farmerName =
        payment.farmer?.user?.name?.toLowerCase() || '';

      const farmName =
        payment.farmer?.farmName?.toLowerCase() || '';

      const productName =
        payment.product?.name?.toLowerCase() || '';

      const reference =
        payment.referenceNumber?.toLowerCase() || '';

      return [
        farmerName,
        farmName,
        productName,
        reference
      ].some((value) => value.includes(searchTerm));
    });
  }

  return successResponse(res, {
    payments: filteredPayments,
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