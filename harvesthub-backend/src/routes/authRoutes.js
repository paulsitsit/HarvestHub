import express from 'express';
import { body } from 'express-validator';
import {
  registerFarmer,
  login,
  getMe,
  changePassword
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const emailValidation = body('email')
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('A valid email is required');

const passwordValidation = body('password')
  .isString()
  .isLength({ min: 8, max: 100 })
  .withMessage('Password must be between 8 and 100 characters');

const registrationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  emailValidation,

  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone number is too long'),

  passwordValidation,

  body('farmName')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Farm name must be between 2 and 150 characters'),

  body('bio')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Bio cannot exceed 2,000 characters'),

  body('address')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Address cannot exceed 300 characters'),

  body('municipality')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Municipality cannot exceed 100 characters'),

  body('province')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Province cannot exceed 100 characters'),

  body('contactNumber')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Contact number is too long'),

  validate
];

const loginValidation = [
  emailValidation,
  passwordValidation,
  validate
];

const changePasswordValidation = [
  body('currentPassword')
    .isString()
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isString()
    .isLength({ min: 8, max: 100 })
    .withMessage('New password must be between 8 and 100 characters'),

  validate
];

router.post(
  '/register',
  authLimiter,
  registrationValidation,
  registerFarmer
);

router.post(
  '/login',
  authLimiter,
  loginValidation,
  login
);

router.get(
  '/me',
  verifyToken,
  getMe
);

router.put(
  '/change-password',
  verifyToken,
  changePasswordValidation,
  changePassword
);

export default router;