import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getFarmerProfile,
  updateFarmerProfile,
  getFarmerDashboard,
  getFarmerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductAvailability
} from '../controllers/farmerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { requireApprovedFarmer } from '../middleware/approvedFarmer.js';
import {
  profileUpload,
  productUpload,
  setUploadType
} from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validate.js';
import { ROLES, UNITS } from '../config/constants.js';

const router = express.Router();

const farmerOnly = [
  verifyToken,
  authorize(ROLES.FARMER)
];

const profileValidation = [
  body('farmName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Farm name must be between 2 and 150 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Bio cannot exceed 2,000 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Address cannot exceed 300 characters'),

  body('municipality')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Municipality cannot exceed 100 characters'),

  body('province')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Province cannot exceed 100 characters'),

  body('contactNumber')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Contact number is too long'),

  validate
];

const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Product name must be between 2 and 150 characters'),

  body('category')
    .isMongoId()
    .withMessage('A valid category is required'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),

  body('unit')
    .isIn(UNITS)
    .withMessage(`Unit must be one of: ${UNITS.join(', ')}`),

  body('quantity')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a non-negative number'),

  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 3000 })
    .withMessage('Description cannot exceed 3,000 characters'),

  body('harvestDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Harvest date must be a valid date'),

  validate
];

const productIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),

  validate
];

const availabilityValidation = [
  ...productIdValidation,

  body('availability')
    .optional()
    .isIn(['available', 'low_stock', 'sold_out'])
    .withMessage('Invalid availability status'),

  body('quantity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a non-negative number'),

  validate
];

router.get(
  '/profile',
  farmerOnly,
  getFarmerProfile
);

router.put(
  '/profile',
  farmerOnly,
  setUploadType('profiles'),
  profileUpload,
  profileValidation,
  updateFarmerProfile
);

router.get(
  '/dashboard',
  farmerOnly,
  getFarmerDashboard
);

router.get(
  '/products',
  farmerOnly,
  [
    query('status')
      .optional()
      .isIn([
        'pending',
        'approved',
        'rejected',
        'expired',
        'removed'
      ])
      .withMessage('Invalid product status'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),

    validate
  ],
  getFarmerProducts
);

router.post(
  '/products',
  farmerOnly,
  requireApprovedFarmer,
  setUploadType('products'),
  productUpload,
  productValidation,
  createProduct
);

router.put(
  '/products/:id',
  farmerOnly,
  setUploadType('products'),
  productUpload,
  productValidation,
  productIdValidation,
  updateProduct
);

router.delete(
  '/products/:id',
  farmerOnly,
  productIdValidation,
  deleteProduct
);

router.patch(
  '/products/:id/availability',
  farmerOnly,
  availabilityValidation,
  updateProductAvailability
);

export default router;