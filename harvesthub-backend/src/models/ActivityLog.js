import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    targetType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    note: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

activityLogSchema.index({
  createdAt: -1
});

export default mongoose.model('ActivityLog', activityLogSchema);