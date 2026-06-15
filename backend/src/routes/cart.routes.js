const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { addToCartSchema, updateCartItemSchema } = require('../validators/cart.validator');

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current user's cart
 *     responses:
 *       200:
 *         description: Cart with populated product details
 */
router.get('/', authenticate, getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
 */
router.post('/items', authenticate, validate(addToCartSchema), addToCart);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   put:
 *     tags: [Cart]
 *     summary: Update cart item quantity
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/items/:itemId', authenticate, validate(updateCartItemSchema), updateCartItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 */
router.delete('/items/:itemId', authenticate, removeCartItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear entire cart
 */
router.delete('/', authenticate, clearCart);

module.exports = router;
