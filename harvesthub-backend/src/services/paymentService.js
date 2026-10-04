import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import {
  LISTING_DAYS,
  LISTING_FEE,
  PAYMENT_STATUSES,
  PRODUCT_STATUSES
} from '../config/constants.js';

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getListingPeriod = (product) => {
  const now = new Date();

  const periodStart =
    product.feePaidUntil && product.feePaidUntil > now
      ? new Date(product.feePaidUntil)
      : now;

  const periodEnd = addDays(periodStart, LISTING_DAYS);

  return {
    periodStart,
    periodEnd
  };
};

export const createPendingPayment = async ({
  farmerId,
  productId,
  referenceNumber,
  method,
  proofImage
}) => {
  const product = await Product.findOne({
    _id: productId,
    farmer: farmerId
  });

  if (!product) {
    const error = new Error(
      'Product not found or does not belong to this farmer'
    );

    error.statusCode = 404;
    throw error;
  }

  if (product.status === PRODUCT_STATUSES.REMOVED) {
    const error = new Error(
      'Removed products cannot be renewed'
    );

    error.statusCode = 400;
    throw error;
  }

  const existingPendingPayment = await Payment.findOne({
    farmer: farmerId,
    product: productId,
    status: PAYMENT_STATUSES.PENDING
  });

  if (existingPendingPayment) {
    const error = new Error(
      'This product already has a pending payment submission'
    );

    error.statusCode = 409;
    throw error;
  }

  const { periodStart, periodEnd } = getListingPeriod(product);

  const payment = await Payment.create({
    farmer: farmerId,
    product: productId,
    amount: LISTING_FEE,
    periodStart,
    periodEnd,
    method,
    referenceNumber,
    proofImage,
    status: PAYMENT_STATUSES.PENDING
  });

  return Payment.findById(payment._id)
    .populate('product', 'name status feePaidUntil')
    .populate('farmer', 'farmName municipality province');
};

export const verifyPaymentAndActivateProduct = async ({
  paymentId,
  adminId
}) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const payment = await Payment.findOne({
        _id: paymentId,
        status: PAYMENT_STATUSES.PENDING
      }).session(session);

      if (!payment) {
        const error = new Error(
          'Pending payment not found'
        );

        error.statusCode = 404;
        throw error;
      }

      const product = await Product.findById(
        payment.product
      ).session(session);

      if (!product) {
        const error = new Error(
          'The product connected to this payment no longer exists'
        );

        error.statusCode = 404;
        throw error;
      }

      if (product.status === PRODUCT_STATUSES.REMOVED) {
        const error = new Error(
          'Removed products cannot be activated'
        );

        error.statusCode = 400;
        throw error;
      }

      payment.status = PAYMENT_STATUSES.VERIFIED;
      payment.verifiedBy = adminId;
      payment.verifiedAt = new Date();

      await payment.save({
        session,
        validateBeforeSave: true
      });

      product.feePaidUntil = payment.periodEnd;
      product.status = PRODUCT_STATUSES.APPROVED;

      await product.save({
        session,
        validateBeforeSave: true
      });

      result = {
        payment,
        product
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

export const rejectPayment = async ({
  paymentId,
  adminId,
  rejectionReason
}) => {
  const payment = await Payment.findOne({
    _id: paymentId,
    status: PAYMENT_STATUSES.PENDING
  });

  if (!payment) {
    const error = new Error(
      'Pending payment not found'
    );

    error.statusCode = 404;
    throw error;
  }

  payment.status = PAYMENT_STATUSES.REJECTED;
  payment.verifiedBy = adminId;
  payment.verifiedAt = new Date();
  payment.rejectionReason = rejectionReason || '';

  await payment.save();

  return payment;
};