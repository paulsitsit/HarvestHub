import mongoose from 'mongoose';
import { LISTING_FEE, PAYMENT_STATUSES } from '../config/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FarmerProfile',
      required: true,
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      default: LISTING_FEE,
      min: 0
    },
    periodStart: {
      type: Date,
      required: true
    },
    periodEnd: {
      type: Date,
      required: true
    },
    method: {
      type: String,
      enum: ['gcash', 'bank_transfer', 'cash', 'other'],
      default: 'gcash'
    },
    referenceNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    proofImage: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUSES),
      default: PAYMENT_STATUSES.PENDING,
      index: true
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({
  farmer: 1,
  product: 1,
  createdAt: -1
});

export default mongoose.model('Payment', paymentSchema);