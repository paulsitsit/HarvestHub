import mongoose from 'mongoose';
import {
  PRODUCT_AVAILABILITY,
  PRODUCT_STATUSES,
  UNITS
} from '../config/constants.js';

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FarmerProfile',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 150
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: UNITS,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    availability: {
      type: String,
      enum: Object.values(PRODUCT_AVAILABILITY),
      default: PRODUCT_AVAILABILITY.AVAILABLE,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: ''
    },
    images: {
      type: [String],
      validate: {
        validator: (images) => images.length <= 5,
        message: 'A product can have up to 5 images'
      },
      default: []
    },
    harvestDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUSES),
      default: PRODUCT_STATUSES.PENDING,
      index: true
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    feePaidUntil: {
      type: Date,
      default: null,
      index: true
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({
  name: 'text',
  description: 'text'
});

productSchema.virtual('isFeeActive').get(function isFeeActive() {
  return Boolean(this.feePaidUntil && this.feePaidUntil > new Date());
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);