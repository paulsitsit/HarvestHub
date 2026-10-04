import mongoose from 'mongoose';
import { FARMER_STATUSES } from '../config/constants.js';

const farmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    farmName: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
      maxlength: 150
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    address: {
      type: String,
      trim: true,
      maxlength: 300,
      default: ''
    },
    municipality: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ''
    },
    province: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ''
    },
    contactNumber: {
      type: String,
      trim: true,
      maxlength: 30,
      default: ''
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    farmPhotos: {
      type: [String],
      default: []
    },
    validIdImage: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: Object.values(FARMER_STATUSES),
      default: FARMER_STATUSES.PENDING,
      index: true
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    isFlaggedFraud: {
      type: Boolean,
      default: false
    },
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0
    },
    approvedAt: {
      type: Date,
      default: null
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

farmerProfileSchema.index({
  farmName: 'text',
  municipality: 'text',
  province: 'text'
});

export default mongoose.model('FarmerProfile', farmerProfileSchema);