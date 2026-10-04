import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const token = authorization.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is missing'
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Your session has expired. Please log in again.'
        : 'Invalid authentication token';

    return res.status(401).json({
      success: false,
      message
    });
  }

  if (!decoded.userId) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication payload'
    });
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User account not found'
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'This account is inactive'
    });
  }

  req.user = user;
  next();
});