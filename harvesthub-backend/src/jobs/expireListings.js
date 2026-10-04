import cron from 'node-cron';
import Product from '../models/Product.js';
import {
  PRODUCT_STATUSES
} from '../config/constants.js';

export const expireListings = async () => {
  const result = await Product.updateMany(
    {
      status: PRODUCT_STATUSES.APPROVED,
      feePaidUntil: {
        $lte: new Date()
      }
    },
    {
      $set: {
        status: PRODUCT_STATUSES.EXPIRED
      }
    }
  );

  if (result.modifiedCount > 0) {
    console.log(
      `Expired ${result.modifiedCount} listing(s)`
    );
  }

  return result;
};

export const startListingExpiryJob = () => {
  cron.schedule(
    '0 0 * * *',
    async () => {
      try {
        await expireListings();
      } catch (error) {
        console.error(
          `Listing expiry job failed: ${error.message}`
        );
      }
    },
    {
      timezone: 'Asia/Manila',
      noOverlap: true
    }
  );

  console.log(
    'Listing expiry job scheduled for midnight Asia/Manila'
  );
};