const express = require('express');
const router = express.Router();
const {
  createReview, getProductReviews, updateReview, deleteReview, getMyReviews,
} = require('../controllers/review.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createReviewSchema, updateReviewSchema } = require('../validators/review.validator');

/**
 * @swagger
 * /reviews/my:
 *   get:
 *     tags: [Reviews]
 *     summary: Get my reviews
 */
router.get('/my', authenticate, getMyReviews);

/**
 * @swagger
 * /reviews/product/{productId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews for a product
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/product/:productId', getProductReviews);

/**
 * @swagger
 * /reviews/product/{productId}:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, comment]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               comment:
 *                 type: string
 */
router.post('/product/:productId', authenticate, validate(createReviewSchema), createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review
 */
router.put('/:id', authenticate, validate(updateReviewSchema), updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
 */
router.delete('/:id', authenticate, deleteReview);

module.exports = router;
