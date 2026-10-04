import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { startListingExpiryJob } from './src/jobs/expireListings.js';

const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await connectDB();

    startListingExpiryJob();

    app.listen(port, () => {
      console.log(`HarvestHub API listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();