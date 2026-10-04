import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import FarmerProfile from '../models/FarmerProfile.js';
import generateToken from '../utils/generateToken.js';
import { successResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ROLES } from '../config/constants.js';

const sanitizeUser = (user) => {
  const safeUser = user.toObject ? user.toObject() : { ...user };

  delete safeUser.password;

  return safeUser;
};

const getProfileForUser = async (user) => {
  if (user.role !== ROLES.FARMER) {
    return null;
  }

  return FarmerProfile.findOne({
    user: user._id
  }).lean();
};

export const registerFarmer = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone = '',
    password,
    farmName,
    bio = '',
    address = '',
    municipality = '',
    province = '',
    contactNumber = ''
  } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists'
    });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password,
    role: ROLES.FARMER
  });

  try {
    const farmerProfile = await FarmerProfile.create({
      user: user._id,
      farmName: farmName.trim(),
      bio: bio.trim(),
      address: address.trim(),
      municipality: municipality.trim(),
      province: province.trim(),
      contactNumber: contactNumber.trim()
    });

    const token = generateToken(user);

    return successResponse(
      res,
      {
        token,
        user: sanitizeUser(user),
        farmerProfile
      },
      'Registration successful. Your farmer account is pending admin approval.',
      201
    );
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'This account is inactive'
    });
  }

  user.lastLogin = new Date();
  await user.save();

  const profile = await getProfileForUser(user);
  const token = generateToken(user);

  return successResponse(res, {
    token,
    user: sanitizeUser(user),
    farmerProfile: profile
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const profile = await getProfileForUser(req.user);

  return successResponse(res, {
    user: sanitizeUser(req.user),
    farmerProfile: profile
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User account not found'
    });
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from the current password'
    });
  }

  user.password = newPassword;
  await user.save();

  return successResponse(
    res,
    null,
    'Password changed successfully'
  );
});