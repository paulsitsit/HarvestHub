import express from 'express';
import { body, param, query } from 'express-validator';

import {
  getAdminFarmers,
  getAdminFarmerById,
  approveFarmer,
  rejectFarmer,
  suspendFarmer,
  reactivateFarmer,
  flagFarmerFraud
} from '../controllers/adminFarmerController.js';

import { getAdminDashboard } from '../controllers/adminDashboardController.js';

import {
  getAdminProducts,
  getAdminProductById,
  approveProduct,
  rejectProduct,
  expireProduct,
  removeProduct
} from '../controllers/adminProductController.js';

import {
  getAdminPayments,
  getAdminPaymentById,
  verifyAdminPayment,
  rejectAdminPayment
} from '../controllers/adminPaymentController.js';

import {
  getAdminUsers,
  updateUserStatus,
  resetUserPassword,
  deleteUser
} from '../controllers/adminUserController.js';

import {
  getAdminReviews,
  getAdminReviewStats,
  hideReview,
  flagReview,
  restoreReview,
  deleteReview
} from '../controllers/adminReviewController.js';

import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

const adminOnly = [
  verifyToken,
  authorize(ROLES.ADMIN)
];

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  '/dashboard',
  adminOnly,
  getAdminDashboard
);

/*
|--------------------------------------------------------------------------
| Farmers
|--------------------------------------------------------------------------
*/

router.get(
  '/farmers',
  adminOnly,
  [
    query('status')
      .optional()
      .isIn([
        'pending',
        'approved',
        'rejected',
        'suspended'
      ])
      .withMessage('Invalid farmer status'),

    query('flagged')
      .optional()
      .isBoolean()
      .withMessage('Flagged must be true or false'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),

    validate
  ],
  getAdminFarmers
);

router.get(
  '/farmers/:id',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    validate
  ],
  getAdminFarmerById
);

router.patch(
  '/farmers/:id/approve',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    validate
  ],
  approveFarmer
);

router.patch(
  '/farmers/:id/reject',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    body('rejectionReason')
      .trim()
      .isLength({ min: 5, max: 1000 })
      .withMessage(
        'Rejection reason must be between 5 and 1,000 characters'
      ),

    validate
  ],
  rejectFarmer
);

router.patch(
  '/farmers/:id/suspend',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    body('reason')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Suspension reason is too long'),

    validate
  ],
  suspendFarmer
);

router.patch(
  '/farmers/:id/reactivate',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    validate
  ],
  reactivateFarmer
);

router.patch(
  '/farmers/:id/flag-fraud',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    body('flagged')
      .optional()
      .isBoolean()
      .withMessage('Flagged must be true or false'),

    body('note')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Fraud note is too long'),

    validate
  ],
  flagFarmerFraud
);

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

router.get(
  '/products',
  adminOnly,
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

    query('farmer')
      .optional()
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    query('category')
      .optional()
      .isMongoId()
      .withMessage('Invalid category ID'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),

    validate
  ],
  getAdminProducts
);

router.get(
  '/products/:id',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),

    validate
  ],
  getAdminProductById
);

router.patch(
  '/products/:id/approve',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),

    validate
  ],
  approveProduct
);

router.patch(
  '/products/:id/reject',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),

    body('rejectionReason')
      .trim()
      .isLength({ min: 5, max: 1000 })
      .withMessage(
        'Rejection reason must be between 5 and 1,000 characters'
      ),

    validate
  ],
  rejectProduct
);

router.patch(
  '/products/:id/expire',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),

    validate
  ],
  expireProduct
);

router.delete(
  '/products/:id',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),

    validate
  ],
  removeProduct
);

/*
|--------------------------------------------------------------------------
| Payments
|--------------------------------------------------------------------------
*/

router.get(
  '/payments',
  adminOnly,
  [
    query('status')
      .optional()
      .isIn([
        'pending',
        'verified',
        'rejected'
      ])
      .withMessage('Invalid payment status'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),

    validate
  ],
  getAdminPayments
);

router.get(
  '/payments/:id',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid payment ID'),

    validate
  ],
  getAdminPaymentById
);

router.patch(
  '/payments/:id/verify',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid payment ID'),

    validate
  ],
  verifyAdminPayment
);

router.patch(
  '/payments/:id/reject',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid payment ID'),

    body('rejectionReason')
      .trim()
      .isLength({ min: 5, max: 1000 })
      .withMessage(
        'Rejection reason must be between 5 and 1,000 characters'
      ),

    validate
  ],
  rejectAdminPayment
);

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

router.get(
  '/users',
  adminOnly,
  [
    query('role')
      .optional()
      .isIn([
        'farmer',
        'admin'
      ])
      .withMessage('Invalid user role'),

    query('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be true or false'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),

    validate
  ],
  getAdminUsers
);

router.patch(
  '/users/:id/status',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),

    body('isActive')
      .isBoolean()
      .withMessage('isActive must be true or false'),

    validate
  ],
  updateUserStatus
);

router.patch(
  '/users/:id/reset-password',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),

    body('newPassword')
      .isString()
      .isLength({ min: 8, max: 100 })
      .withMessage(
        'New password must be between 8 and 100 characters'
      ),

    validate
  ],
  resetUserPassword
);

router.delete(
  '/users/:id',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),

    validate
  ],
  deleteUser
);

/*
|--------------------------------------------------------------------------
| Reviews
|--------------------------------------------------------------------------
*/

router.get(
  '/reviews',
  adminOnly,
  [
    query('status')
      .optional()
      .isIn([
        'visible',
        'hidden',
        'flagged'
      ])
      .withMessage('Invalid review status'),

    query('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),

    query('farmer')
      .optional()
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),

    validate
  ],
  getAdminReviews
);

router.get(
  '/reviews/stats',
  adminOnly,
  getAdminReviewStats
);

router.patch(
  '/reviews/:id/hide',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID'),

    validate
  ],
  hideReview
);

router.patch(
  '/reviews/:id/flag',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID'),

    body('reason')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Flag reason is too long'),

    validate
  ],
  flagReview
);

router.patch(
  '/reviews/:id/restore',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID'),

    validate
  ],
  restoreReview
);

router.delete(
  '/reviews/:id',
  adminOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID'),

    validate
  ],
  deleteReview
);

export default router;