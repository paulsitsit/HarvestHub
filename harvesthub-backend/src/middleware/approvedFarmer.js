import FarmerProfile from '../models/FarmerProfile.js';
import { FARMER_STATUSES } from '../config/constants.js';

export const requireApprovedFarmer = async (req, res, next) => {
  const profile = await FarmerProfile.findOne({
    user: req.user._id
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Farmer profile not found'
    });
  }

  if (profile.status !== FARMER_STATUSES.APPROVED) {
    return res.status(403).json({
      success: false,
      message: 'Your farmer account must be approved before listing products'
    });
  }

  req.farmerProfile = profile;
  next();
};