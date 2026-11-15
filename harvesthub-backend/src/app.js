import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import {
  notFound,
  errorHandler
} from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://harvest-hub-tau-ten.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header,
      // such as health checks.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `CORS origin not allowed: ${origin}`
        )
      );
    },
    credentials: true
  })
);

app.use(
  express.json({
    limit: '1mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb'
  })
);

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
);

app.get('/uploads/cloudinary/*', (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const publicId = req.params[0];

  if (!cloudName || !publicId || !/^[a-zA-Z0-9/_-]+$/.test(publicId)) {
    return res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }

  return res.redirect(
    302,
    `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`
  );
});

app.use(
  '/uploads',
  express.static(
    path.resolve(__dirname, '../uploads')
  )
);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HarvestHub API is running'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HarvestHub API is running',
    data: {
      environment:
        process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/farmer/inquiries', inquiryRoutes);
app.use('/api/farmer/payments', paymentRoutes);
app.use('/api/farmer/reviews', reviewRoutes);

// Keep these last.
app.use(notFound);
app.use(errorHandler);

export default app;