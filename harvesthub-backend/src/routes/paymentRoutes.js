import express from 'express';
import { body, query } from 'express-validator';
import {
  getFarmerPayments,
  submitPaymentProof
} from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  imageUpload,
  setUploadType
} from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

const farmerOnly = [
  verifyToken,
  authorize(ROLES.FARMER)
];

router.get(
  '/',
  farmerOnly,
  [
    query('product')
      .optional()
      .isMongoId()
      .withMessage('Invalid product ID'),

    query('status')
      .optional()
      .isIn(['pending', 'verified', 'rejected'])
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
  getFarmerPayments
);

router.post(
  '/',
  farmerOnly,
  setUploadType('payments'),
  imageUpload.single('proofImage'),
  [
    body('productId')
      .isMongoId()
      .withMessage('A valid product ID is required'),

    body('referenceNumber')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage(
        'Reference number must be between 3 and 100 characters'
      ),

    body('method')
      .optional()
      .isIn([
        'gcash',
        'bank_transfer',
        'cash',
        'other'
      ])
      .withMessage('Invalid payment method'),

    validate
  ],
  submitPaymentProof
);

export default router;