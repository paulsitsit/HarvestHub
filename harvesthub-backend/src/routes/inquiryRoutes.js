import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getFarmerInquiries,
  updateInquiryStatus
} from '../controllers/inquiryController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
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
    query('status')
      .optional()
      .isIn([
        'new',
        'contacted',
        'completed',
        'cancelled'
      ])
      .withMessage('Invalid inquiry status'),

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
  getFarmerInquiries
);

router.patch(
  '/:id/status',
  farmerOnly,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid inquiry ID'),

    body('status')
      .isIn([
        'new',
        'contacted',
        'completed',
        'cancelled'
      ])
      .withMessage('Invalid inquiry status'),

    validate
  ],
  updateInquiryStatus
);

export default router;