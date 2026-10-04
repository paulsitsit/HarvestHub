import express from 'express';
import { query } from 'express-validator';
import { getFarmerReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get(
  '/',
  verifyToken,
  authorize(ROLES.FARMER),
  [
    query('status')
      .optional()
      .isIn(['visible', 'hidden', 'flagged'])
      .withMessage('Invalid review status'),

    query('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),

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
  getFarmerReviews
);

export default router;