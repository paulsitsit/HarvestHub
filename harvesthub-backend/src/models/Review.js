import mongoose from 'mongoose';
import { REVIEW_STATUSES } from '../config/constants.js';

const reviewSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FarmerProfile',
      required: true,
      index: true
    },
    buyerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1500
    },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUSES),
      default: REVIEW_STATUSES.VISIBLE,
      index: true
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({
  farmer: 1,
  status: 1,
  createdAt: -1
});

export default mongoose.model('Review', reviewSchema);