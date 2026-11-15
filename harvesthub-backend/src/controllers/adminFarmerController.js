import mongoose from 'mongoose';
import FarmerProfile from '../models/FarmerProfile.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  FARMER_STATUSES,
  PRODUCT_STATUSES
} from '../config/constants.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\const isValidObjectId = (id) => {');

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

export const getAdminFarmers = asyncHandler(async (req, res) => {
  const {
    status,
    search = '',
    flagged,
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

  if (flagged === 'true') {
    filter.isFlaggedFraud = true;
  }

  const userFilter = {};

  if (search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
    userFilter.$or = [
      {
        name: {
          $regex: searchRegex
        }
      },
      {
        email: {
          $regex: searchRegex
        }
      },
      {
        phone: {
          $regex: search.trim(),
          $options: 'i'
        }
      }
    ];

    const matchingUsers = await User.find(userFilter)
      .select('_id')
      .lean();

    filter.$or = [
      {
        farmName: {
          $regex: search.trim(),
          $options: 'i'
        }
      },
      {
        municipality: {
          $regex: search.trim(),
          $options: 'i'
        }
      },
      {
        province: {
          $regex: search.trim(),
          $options: 'i'
        }
      },
      {
        user: {
          $in: matchingUsers.map((user) => user._id)
        }
      }
    ];
  }

  const [farmers, total] = await Promise.all([
    FarmerProfile.find(filter)
      .populate(
        'user',
        'name email phone isActive lastLogin createdAt'
      )
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    FarmerProfile.countDocuments(filter)
  ]);

  return successResponse(res, {
    farmers,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});

export const getAdminFarmerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid farmer ID'
    });
  }

  const farmer = await FarmerProfile.findById(id)
    .populate(
      'user',
      'name email phone isActive lastLogin createdAt'
    )
    .populate('approvedBy', 'name email')
    .lean();

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  const [products, productCounts] = await Promise.all([
    Product.find({
      farmer: farmer._id
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .lean(),

    Product.aggregate([
      {
        $match: {
          farmer: farmer._id
        }
      },
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1
          }
        }
      }
    ])
  ]);

  return successResponse(res, {
    farmer,
    products,
    productCounts
  });
});

export const approveFarmer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const farmer = await FarmerProfile.findById(id);

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  farmer.status = FARMER_STATUSES.APPROVED;
  farmer.rejectionReason = '';
  farmer.approvedAt = new Date();
  farmer.approvedBy = req.user._id;

  await farmer.save();

  await User.findByIdAndUpdate(
    farmer.user,
    {
      isActive: true
    },
    {
      new: true,
      runValidators: true
    }
  );

  await writeActivityLog({
    actor: req.user._id,
    action: 'approve_farmer',
    targetType: 'FarmerProfile',
    targetId: farmer._id,
    note: 'Farmer account approved'
  });

  const updatedFarmer = await FarmerProfile.findById(farmer._id)
    .populate('user', 'name email phone isActive')
    .populate('approvedBy', 'name email');

  return successResponse(
    res,
    updatedFarmer,
    'Farmer approved successfully'
  );
});

export const rejectFarmer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason = '' } = req.body;

  if (!rejectionReason.trim()) {
    return res.status(422).json({
      success: false,
      message: 'Rejection reason is required'
    });
  }

  const farmer = await FarmerProfile.findById(id);

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  farmer.status = FARMER_STATUSES.REJECTED;
  farmer.rejectionReason = rejectionReason.trim();
  farmer.approvedAt = null;
  farmer.approvedBy = null;

  await farmer.save();

  await writeActivityLog({
    actor: req.user._id,
    action: 'reject_farmer',
    targetType: 'FarmerProfile',
    targetId: farmer._id,
    note: rejectionReason.trim()
  });

  return successResponse(
    res,
    farmer,
    'Farmer rejected successfully'
  );
});

export const suspendFarmer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason = '' } = req.body;

  const farmer = await FarmerProfile.findById(id);

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  farmer.status = FARMER_STATUSES.SUSPENDED;

  if (reason.trim()) {
    farmer.rejectionReason = reason.trim();
  }

  await farmer.save();

  await User.findByIdAndUpdate(
    farmer.user,
    {
      isActive: false
    },
    {
      new: true,
      runValidators: true
    }
  );

  await Product.updateMany(
    {
      farmer: farmer._id,
      status: PRODUCT_STATUSES.APPROVED
    },
    {
      $set: {
        status: PRODUCT_STATUSES.EXPIRED
      }
    },
    {
      runValidators: true
    }
  );

  await writeActivityLog({
    actor: req.user._id,
    action: 'suspend_farmer',
    targetType: 'FarmerProfile',
    targetId: farmer._id,
    note: reason.trim()
  });

  return successResponse(
    res,
    farmer,
    'Farmer suspended successfully'
  );
});

export const reactivateFarmer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const farmer = await FarmerProfile.findById(id);

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  farmer.status = FARMER_STATUSES.APPROVED;
  farmer.rejectionReason = '';

  if (!farmer.approvedAt) {
    farmer.approvedAt = new Date();
  }

  farmer.approvedBy = req.user._id;

  await farmer.save();

  await User.findByIdAndUpdate(
    farmer.user,
    {
      isActive: true
    },
    {
      new: true,
      runValidators: true
    }
  );

  await writeActivityLog({
    actor: req.user._id,
    action: 'reactivate_farmer',
    targetType: 'FarmerProfile',
    targetId: farmer._id,
    note: 'Farmer account reactivated'
  });

  return successResponse(
    res,
    farmer,
    'Farmer reactivated successfully'
  );
});

export const flagFarmerFraud = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { flagged = true, note = '' } = req.body;

  const farmer = await FarmerProfile.findById(id);

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  farmer.isFlaggedFraud = Boolean(flagged);
  await farmer.save();

  await writeActivityLog({
    actor: req.user._id,
    action: flagged
      ? 'flag_farmer_fraud'
      : 'remove_farmer_fraud_flag',
    targetType: 'FarmerProfile',
    targetId: farmer._id,
    note: note.trim()
  });

  return successResponse(
    res,
    farmer,
    flagged
      ? 'Farmer flagged as potential fraud'
      : 'Fraud flag removed'
  );
});