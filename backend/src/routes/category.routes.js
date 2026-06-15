const express = require('express');
const router = express.Router();
const {
  getAllCategories, getCategoryById, getCategoryBySlug,
  createCategory, updateCategory, deleteCategory,
} = require('../controllers/category.controller');
const adminAuth = require('../middleware/adminAuth');
const { validate } = require('../middleware/validate');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all active categories
 *     security: []
 *     responses:
 *       200:
 *         description: List of categories with product counts
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /categories/slug/{slug}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by slug
 *     security: []
 */
router.get('/slug/:slug', getCategoryBySlug);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID
 *     security: []
 */
router.get('/:id', getCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create category (admin)
 */
router.post('/', adminAuth, validate(createCategorySchema), createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update category (admin)
 */
router.put('/:id', adminAuth, validate(updateCategorySchema), updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category (admin)
 */
router.delete('/:id', adminAuth, deleteCategory);

module.exports = router;
