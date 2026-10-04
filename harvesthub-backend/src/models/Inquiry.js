import mongoose from 'mongoose';
import { INQUIRY_STATUSES } from '../config/constants.js';

const inquirySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FarmerProfile',
      required: true,
      index: true
    },
    buyerName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'Guest buyer'
    },
    buyerPhone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: ''
    },
    quantityWanted: {
      type: Number,
      min: 0,
      default: null
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    type: {
      type: String,
      enum: ['call', 'message'],
      required: true
    },
    status: {
      type: String,
      enum: Object.values(INQUIRY_STATUSES),
      default: INQUIRY_STATUSES.NEW,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Inquiry', inquirySchema);