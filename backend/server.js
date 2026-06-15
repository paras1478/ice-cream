console.log('=== Loading dotenv ===');
require('dotenv').config();
console.log('=== Loading express-async-errors ===');
require('express-async-errors');

console.log('=== Loading express ===');
const express = require('express');
console.log('=== Loading helmet ===');
const helmet = require('helmet');
console.log('=== Loading cors ===');
const cors = require('cors');
console.log('=== Loading morgan ===');
const morgan = require('morgan');
console.log('=== Loading mongoSanitize ===');
const mongoSanitize = require('express-mongo-sanitize');
console.log('=== Loading passport ===');
const passport = require('passport');
console.log('=== Loading cookieParser ===');
const cookieParser = require('cookie-parser');

console.log('=== Loading database config ===');
const { connectDB, disconnectDB } = require('./src/config/database');
console.log('=== Loading passport config ===');
const configurePassport = require('./src/config/passport');
console.log('=== Loading swagger config ===');
const { setupSwagger } = require('./src/config/swagger');
console.log('=== Loading logger ===');
const logger = require('./src/config/logger');
console.log('=== Loading routes ===');
const routes = require('./src/routes/index');
console.log('=== Loading errorHandler ===');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
console.log('=== Loading sanitize ===');
const sanitize = require('./src/middleware/sanitize');
console.log('=== Loading rateLimiter ===');
const { apiLimiter } = require('./src/middleware/rateLimiter');

console.log('=== Creating express app ===');
const app = express();
console.log('=== Setting PORT ===');
const PORT = process.env.PORT || 5000;
console.log('PORT:', PORT);

console.log('=== Setting up Security Middleware ===');
// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));
console.log('=== Helmet configured ===');

console.log('=== Setting up CORS ===');
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:5173',
    ].filter(Boolean);

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
console.log('=== CORS configured ===');

// ─── Logging ────────────────────────────────────────────────────────────────
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (msg) => logger.info(msg.trim()) },
  skip: (req) => req.path === '/api/v1/health',
}));

// ─── Stripe Webhook (raw body MUST come before express.json()) ───────────────
app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // After raw body middleware, pass to router
    next();
  }
);

// ─── Static Files (local image uploads) ─────────────────────────────────────
app.use('/uploads', express.static(require('path').join(__dirname, 'public/uploads')));

// ─── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Sanitization ───────────────────────────────────────────────────────────
app.use(mongoSanitize());
app.use(sanitize);

// ─── Passport ───────────────────────────────────────────────────────────────
configurePassport();
app.use(passport.initialize());

// ─── Global Rate Limiting ────────────────────────────────────────────────────
app.use('/api/v1', apiLimiter);

// ─── Swagger Docs ────────────────────────────────────────────────────────────
setupSwagger(app);

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── Root endpoint ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🍦 Ice Cream Store API',
    docs: `${req.protocol}://${req.get('host')}/api-docs`,
    health: `${req.protocol}://${req.get('host')}/api/v1/health`,
    version: '1.0.0',
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
let server;

const ensureCategories = async () => {
  const Category = require('./src/models/Category');
  const count = await Category.countDocuments();
  if (count > 0) return;

  const categories = [
    { name: 'Classic', slug: 'classic', description: 'Timeless ice cream flavors everyone loves', sortOrder: 1 },
    { name: 'Fruit', slug: 'fruit', description: 'Refreshing fruit-based ice creams', sortOrder: 2 },
    { name: 'Chocolate', slug: 'chocolate', description: 'Rich and indulgent chocolate varieties', sortOrder: 3 },
    { name: 'Nutty', slug: 'nutty', description: 'Creamy ice creams with nuts and pralines', sortOrder: 4 },
    { name: 'Sorbet', slug: 'sorbet', description: 'Dairy-free fruit sorbets', sortOrder: 5 },
    { name: 'Premium', slug: 'premium', description: 'Artisan and premium ice cream flavors', sortOrder: 6 },
    { name: 'Seasonal', slug: 'seasonal', description: 'Limited edition seasonal flavors', sortOrder: 7 },
    { name: 'Vegan', slug: 'vegan', description: 'Plant-based dairy-free options', sortOrder: 8 },
  ];

  await Category.insertMany(categories);
  logger.info(`Seeded ${categories.length} categories`);
};

const ensureAdmin = async () => {
  const User = require('./src/models/User');
  const email = process.env.ADMIN_EMAIL || 'admin@icecream.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name: 'Admin', email, password, role: 'admin', isEmailVerified: true, isActive: true });
    logger.info(`Admin user created: ${email}`);
  } else if (existing.role !== 'admin') {
    existing.role = 'admin';
    await existing.save({ validateBeforeSave: false });
    logger.info(`Admin role granted to: ${email}`);
  }
};

const startServer = async () => {
  console.log('Starting server...');
  let dbConnected = null;

  try {
    console.log('Attempting to connect to database...');
    dbConnected = await connectDB();
    console.log('Database connection result:', dbConnected ? 'CONNECTED' : 'FAILED');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    logger.error('Database connection failed:', error.message);
    logger.warn('Continuing server startup without database...');
  }

  if (dbConnected !== null) {
    try {
      await ensureAdmin();
      await ensureCategories();
    } catch (error) {
      logger.error('Database seeding failed:', error.message);
    }
  } else {
    logger.warn('Skipping database seeding - MongoDB not connected');
  }

  server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    logger.info(`API: http://localhost:${PORT}/api/v1`);
    logger.info(`Docs: http://localhost:${PORT}/api-docs`);
    if (dbConnected === null) {
      logger.warn('⚠️  SERVER STARTED WITHOUT DATABASE CONNECTION');
      logger.warn('⚠️  Please whitelist your IP in MongoDB Atlas to enable database features');
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use`);
    } else {
      logger.error('Server error:', err);
    }
    process.exit(1);
  });
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      logger.info('Graceful shutdown complete');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', { reason, promise });
});

process.on('uncaughtException', (err) => {
  console.error('!!! UNCAUGHT EXCEPTION !!!', err);
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

console.log('=== Calling startServer() ===');
startServer();

module.exports = app;

