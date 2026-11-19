import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';
import taxSlabRoutes from './routes/taxSlabRoutes.js';
import companyCostRoutes from './routes/companyCostRoutes.js';
import authRoutes from './routes/authRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import { ensureAdminSeeded } from './controllers/authController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    server: 'QWCA Express API',
    database: isDbConnected() ? 'connected (MongoDB)' : 'in-memory resilient mode (MongoDB offline)',
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
  await ensureAdminSeeded();
  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 QWCA Express Backend running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Admin Auth API: http://localhost:${PORT}/api/auth/login`);
    console.log(`📊 Tax Slabs API: http://localhost:${PORT}/api/tax-slabs`);
    console.log(`💼 Cost Estimator API: http://localhost:${PORT}/api/cost-estimation`);
    console.log(`🌐 Allowed Client Origin: ${CLIENT_URL}`);
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
}

startServer();
