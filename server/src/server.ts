import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, isDbConnected, isAtlasConnection, sanitizeMongoUri } from './config/db.js';
import taxSlabRoutes from './routes/taxSlabRoutes.js';
import companyCostRoutes from './routes/companyCostRoutes.js';
import authRoutes from './routes/authRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qwca_database';

// Enable trust proxy for production deployments behind reverse proxies (Vercel, Railway, Render, Nginx)
app.set('trust proxy', 1);

// Build permitted CORS origins list
const rawClientUrls = process.env.CLIENT_URL || 'http://localhost:3000';
const configuredOrigins = rawClientUrls
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultOrigins]));

// CORS Middleware with dynamic origin validation
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. server-to-server, curl, Postman, health probes)
      if (!origin) return callback(null, true);

      // Allow configured origins or any Vercel deployment preview origin
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // In non-production mode, permit local development
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error(`[CORS Blocked] Origin not allowed: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const connected = isDbConnected();
  const atlas = isAtlasConnection();

  res.json({
    status: 'online',
    server: 'QWCA Express API',
    environment: process.env.NODE_ENV || 'development',
    database: connected
      ? atlas
        ? 'MongoDB Atlas (Cloud Cluster)'
        : 'MongoDB Connected (Local/Docker)'
      : 'in-memory resilient mode (MongoDB offline)',
    databaseType: connected ? (atlas ? 'atlas' : 'local') : 'in-memory',
    connectionEndpoint: connected ? sanitizeMongoUri(mongoUri) : 'offline',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tax-slabs', taxSlabRoutes);
app.use('/api/cost-estimation', companyCostRoutes);
app.use('/api/events', eventsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Start Server
async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    const isAtlas = isAtlasConnection();
    console.log(`=========================================`);
    console.log(`🚀 QWCA Express Backend running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: ${isDbConnected() ? (isAtlas ? 'MongoDB Atlas (Cloud)' : 'MongoDB (Local/Docker)') : 'In-Memory Fallback'}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Admin Auth API: http://localhost:${PORT}/api/auth/login`);
    console.log(`📊 Tax Slabs API: http://localhost:${PORT}/api/tax-slabs`);
    console.log(`💼 Cost Estimator API: http://localhost:${PORT}/api/cost-estimation`);
    console.log(`🔗 Allowed Client Origins: ${allowedOrigins.join(', ')}`);
    console.log(`=========================================`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ [Server Error] Port ${PORT} is already in use by another process.`);
      console.error(`👉 Tip: Run 'npm run clean:port' to auto-terminate the blocking process, then restart.\n`);
      process.exit(1);
    } else {
      console.error('\n❌ [Server Error]:', err);
    }
  });

  // Graceful Shutdown on termination signals
  const shutdown = async (signal: string) => {
    console.log(`\n[Server] ${signal} signal received. Closing HTTP server and database connection gracefully...`);
    server.close(async () => {
      try {
        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.close(false);
          console.log('[Server] MongoDB connection closed cleanly.');
        }
      } catch (closeErr: any) {
        console.error('[Server] Error closing MongoDB connection:', closeErr.message);
      }
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();
