const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const reviewRoutes = require('./review.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const paymentRoutes = require('./payment.routes');
const couponRoutes = require('./coupon.routes');
const addressRoutes = require('./address.routes');
const uploadRoutes = require('./upload.routes');
const wishlistRoutes = require('./wishlist.routes');
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/coupons', couponRoutes);
router.use('/addresses', addressRoutes);
router.use('/upload', uploadRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Ice Cream API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;
