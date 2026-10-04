import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import FarmerProfile from '../models/FarmerProfile.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { INQUIRY_STATUSES } from '../config/constants.js';

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const getFarmerInquiries = asyncHandler(async (req, res) => {
  const farmerProfile = await FarmerProfile.findOne({
    user: req.user._id
  }).select('_id');

  if (!farmerProfile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  const {
    status,
    page = 1,
    limit = 20
  } = req.query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const filter = {
    farmer: farmerProfile._id
  };

  if (status) {
    filter.status = status;
  }

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate('product', 'name price unit images availability')
      .populate('farmer', 'farmName contactNumber')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Inquiry.countDocuments(filter)
  ]);

  return successResponse(res, {
    inquiries,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      pages: Math.ceil(total / pageLimit)
    }
  });
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid inquiry ID'
    });
  }

  const farmerProfile = await FarmerProfile.findOne({
    user: req.user._id
  }).select('_id');

  if (!farmerProfile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  const inquiry = await Inquiry.findOne({
    _id: id,
    farmer: farmerProfile._id
  })
    .populate('product', 'name price unit')
    .populate('farmer', 'farmName contactNumber');

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found'
    });
  }

  inquiry.status = status;
  await inquiry.save();

  return successResponse(
    res,
    inquiry,
    'Inquiry status updated successfully'
  );
});