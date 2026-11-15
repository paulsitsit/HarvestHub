import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getCategories,
  getPublicProducts,
  getPublicProductById,
  getPublicFarmerById,
  getFarmerReviews,
  getFeatured,
  createInquiry,
  createReview
} from '../controllers/publicController.js';
import { publicWriteLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get(
  '/categories',
  getCategories
);

router.get(
  '/products',
  [
    query('search')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 150 })
      .withMessage('Search is too long'),

    query('category')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 })
      .withMessage('Category is too long'),

    query('municipality')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 })
      .withMessage('Municipality is too long'),

    query('minPrice')
      .optional({ values: 'falsy' })
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be non-negative'),

    query('maxPrice')
      .optional({ values: 'falsy' })
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be non-negative'),

    query('minRating')
      .optional({ values: 'falsy' })
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rating must be between 0 and 5'),

    query('availability')
      .optional({ values: 'falsy' })
      .isIn(['available', 'low_stock', 'sold_out'])
      .withMessage('Invalid availability'),

    query('sort')
      .optional({ values: 'falsy' })
      .isIn([
        'newest',
        'oldest',
        'price_low',
        'price_high',
        'rating',
        'popular'
      ])
      .withMessage('Invalid sort option'),

    validate
  ],
  getPublicProducts
);

router.get(
  '/products/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),

    validate
  ],
  getPublicProductById
);

router.get(
  '/farmers/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    validate
  ],
  getPublicFarmerById
);

router.get(
  '/farmers/:id/reviews',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid farmer ID'),

    validate
  ],
  getFarmerReviews
);

router.get(
  '/featured',
  getFeatured
);

router.post(
  '/inquiries',
  publicWriteLimiter,
  [
    body('product')
      .isMongoId()
      .withMessage('A valid product is required'),

    body('buyerName')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 100 })
      .withMessage('Buyer name is too long'),

    body('buyerPhone')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 30 })
      .withMessage('Buyer phone is too long'),

    body('quantityWanted')
      .optional({ values: 'falsy' })
      .isFloat({ min: 0 })
      .withMessage('Quantity wanted must be non-negative'),

    body('message')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Message cannot exceed 1,000 characters'),

    body('type')
      .optional()
      .isIn(['call', 'message'])
      .withMessage('Inquiry type must be call or message'),

    body('website')
      .optional()
      .isEmpty()
      .withMessage('Spam check failed'),

    validate
  ],
  createInquiry
);

router.post(
  '/reviews',
  publicWriteLimiter,
  [
    body('farmer')
      .isMongoId()
      .withMessage('A valid farmer is required'),

    body('buyerName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Buyer name must be between 2 and 100 characters'),

    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),

    body('comment')
      .trim()
      .isLength({ min: 5, max: 1500 })
      .withMessage('Comment must be between 5 and 1,500 characters'),

    body('website')
      .optional()
      .isEmpty()
      .withMessage('Spam check failed'),

    validate
  ],
  createReview
);

export default router;
