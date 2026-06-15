const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlist.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get user's wishlist
 */
router.get('/', authenticate, getWishlist);

/**
 * @swagger
 * /wishlist/{productId}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add product to wishlist
 */
router.post('/:productId', authenticate, addToWishlist);

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove product from wishlist
 */
router.delete('/:productId', authenticate, removeFromWishlist);

/**
 * @swagger
 * /wishlist:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Clear entire wishlist
 */
router.delete('/', authenticate, clearWishlist);

module.exports = router;
