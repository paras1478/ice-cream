const express = require('express');
const router = express.Router();
const { uploadImages, deleteImage, getPresignedUrl } = require('../controllers/upload.controller');
const { authenticate } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { uploadMultiple } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * /upload/images:
 *   post:
 *     tags: [Upload]
 *     summary: Upload images to R2 (admin)
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns array of public URLs
 */
router.post('/images', adminAuth, uploadLimiter, uploadMultiple('images', 10), uploadImages);

/**
 * @swagger
 * /upload/images:
 *   delete:
 *     tags: [Upload]
 *     summary: Delete an image from R2 (admin)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 */
router.delete('/images', adminAuth, deleteImage);

/**
 * @swagger
 * /upload/presigned-url:
 *   get:
 *     tags: [Upload]
 *     summary: Get presigned URL for direct client upload
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 */
router.get('/presigned-url', adminAuth, getPresignedUrl);

module.exports = router;
