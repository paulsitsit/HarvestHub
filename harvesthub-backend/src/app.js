import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
);

app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '../uploads'))
);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HarvestHub API is running',
    data: {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;