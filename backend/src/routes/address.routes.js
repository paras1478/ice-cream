const express = require('express');
const router = express.Router();
const { addAddress, getAddresses, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/address.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createAddressSchema, updateAddressSchema } = require('../validators/address.validator');

/**
 * @swagger
 * /addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: Get all user addresses
 */
router.get('/', authenticate, getAddresses);

/**
 * @swagger
 * /addresses:
 *   post:
 *     tags: [Addresses]
 *     summary: Add a new address
 */
router.post('/', authenticate, validate(createAddressSchema), addAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     tags: [Addresses]
 *     summary: Update an address
 */
router.put('/:id', authenticate, validate(updateAddressSchema), updateAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete an address
 */
router.delete('/:id', authenticate, deleteAddress);

/**
 * @swagger
 * /addresses/{id}/default:
 *   patch:
 *     tags: [Addresses]
 *     summary: Set address as default
 */
router.patch('/:id/default', authenticate, setDefaultAddress);

module.exports = router;
