const express = require('express');
const router = express.Router();
const {
  getAllProducts, getProductById, getProductBySlug, createProduct,
  updateProduct, deleteProduct, getFeaturedProducts, getProductsByCategory,
  searchProducts, updateStock,
} = require('../controllers/product.controller');
const { optionalAuth } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validate } = require('../middleware/validate');
const { pagination } = require('../middleware/pagination');
const { createProductSchema, updateProductSchema, updateStockSchema, productQuerySchema } = require('../validators/product.validator');

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products with filters and pagination
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: flavor
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, rating, -rating, createdAt, -createdAt, soldCount, -soldCount]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated product list
 */
router.get('/', validate(productQuerySchema, 'query'), getAllProducts);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     tags: [Products]
 *     summary: Get featured products
 *     security: []
 */
router.get('/featured', getFeaturedProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     tags: [Products]
 *     summary: Search products by text
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/search', searchProducts);

/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by slug
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/slug/:slug', getProductBySlug);

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     tags: [Products]
 *     summary: Get products by category
 *     security: []
 */
router.get('/category/:categoryId', pagination, getProductsByCategory);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     security: []
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 */
router.post('/', adminAuth, validate(createProductSchema), createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product (admin)
 */
router.put('/:id', adminAuth, validate(updateProductSchema), updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product (soft delete, admin)
 */
router.delete('/:id', adminAuth, deleteProduct);

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     tags: [Products]
 *     summary: Update product stock (admin)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *               operation:
 *                 type: string
 *                 enum: [set, increment, decrement]
 */
router.patch('/:id/stock', adminAuth, validate(updateStockSchema), updateStock);

module.exports = router;
