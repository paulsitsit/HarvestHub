import mongoose from 'mongoose';
import User from '../models/User.js';
import FarmerProfile from '../models/FarmerProfile.js';
import Product from '../models/Product.js';
import Inquiry from '../models/Inquiry.js';
import Review from '../models/Review.js';
import Payment from '../models/Payment.js';
import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  FARMER_STATUSES,
  PRODUCT_STATUSES,
  ROLES
} from '../config/constants.js';

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

const sanitizeUser = (user) => {
  const safeUser = user.toObject
    ? user.toObject()
    : { ...user };

  delete safeUser.password;

  return safeUser;
};

export const getAdminUsers = asyncHandler(async (req, res) => {
  const {
    role,
    isActive,
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

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search.trim()) {
    filter.$or = [
      {
        name: {
          $regex: search.trim(),
          $options: 'i'
        }
      },
      {
        email: {
          $regex: search.trim(),
          $options: 'i'
        }
      },
      {
        phone: {
          $regex: search.trim(),
          $options: 'i'
        }
      }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(
        'name email phone role isActive lastLogin createdAt updatedAt'
      )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    User.countDocuments(filter)
  ]);

  const userIds = users.map((user) => user._id);

  const profiles = await FarmerProfile.find({
    user: {
      $in: userIds
    }
  })
    .select('user farmName status avgRating reviewCount')
    .lean();

  const profileMap = new Map(
    profiles.map((profile) => [
      profile.user.toString(),
      profile
    ])
  );

  const usersWithProfiles = users.map((user) => ({
    ...user,
    farmerProfile:
      profileMap.get(user._id.toString()) || null
  }));

  return successResponse(res, {
    users: usersWithProfiles,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (user._id.equals(req.user._id) && !isActive) {
    return res.status(400).json({
      success: false,
      message: 'You cannot deactivate your own account'
    });
  }

  if (
    user.role === ROLES.ADMIN &&
    !isActive
  ) {
    const activeAdminCount = await User.countDocuments({
      role: ROLES.ADMIN,
      isActive: true
    });

    if (activeAdminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'The final active admin cannot be deactivated'
      });
    }
  }

  user.isActive = Boolean(isActive);
  await user.save();

  if (
    user.role === ROLES.FARMER &&
    !user.isActive
  ) {
    await FarmerProfile.findOneAndUpdate(
      {
        user: user._id
      },
      {
        $set: {
          status: FARMER_STATUSES.SUSPENDED
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    const profile = await FarmerProfile.findOne({
      user: user._id
    }).select('_id');

    if (profile) {
      await Product.updateMany(
        {
          farmer: profile._id,
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
    }
  }

  await writeActivityLog({
    actor: req.user._id,
    action: user.isActive
      ? 'activate_user'
      : 'deactivate_user',
    targetType: 'User',
    targetId: user._id,
    note: user.isActive
      ? 'User account activated'
      : 'User account deactivated'
  });

  return successResponse(
    res,
    sanitizeUser(user),
    user.isActive
      ? 'User activated successfully'
      : 'User deactivated successfully'
  );
});

export const resetUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const user = await User.findById(id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.password = newPassword;
  await user.save();

  await writeActivityLog({
    actor: req.user._id,
    action: 'reset_user_password',
    targetType: 'User',
    targetId: user._id,
    note: 'Password reset by administrator'
  });

  return successResponse(
    res,
    null,
    'User password reset successfully'
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (user._id.equals(req.user._id)) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  if (user.role === ROLES.ADMIN) {
    const adminCount = await User.countDocuments({
      role: ROLES.ADMIN
    });

    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'The final administrator cannot be deleted'
      });
    }
  }

  const farmerProfile = await FarmerProfile.findOne({
    user: user._id
  }).select('_id');

  if (farmerProfile) {
    await Promise.all([
      Product.deleteMany({
        farmer: farmerProfile._id
      }),
      Inquiry.deleteMany({
        farmer: farmerProfile._id
      }),
      Review.deleteMany({
        farmer: farmerProfile._id
      }),
      Payment.deleteMany({
        farmer: farmerProfile._id
      }),
      FarmerProfile.findByIdAndDelete(
        farmerProfile._id
      )
    ]);
  }

  await ActivityLog.updateMany(
    {
      actor: user._id
    },
    {
      $set: {
        actor: null,
        note: 'Original actor account deleted'
      }
    }
  );

  await User.findByIdAndDelete(user._id);

  return successResponse(
    res,
    null,
    'User and associated account data deleted successfully'
  );
});