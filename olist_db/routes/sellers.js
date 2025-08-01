/**
 * @swagger
 * tags:
 *   name: Sellers
 *   description: Seller management endpoints
 */
// routes/sellers.js
// This file defines the API routes for sellers.

// ----------------------
// 1. Module Imports
// ----------------------
const express = require('express');
const {
  getAllSellers,
  getSellerById,
  createSeller,
  updateSeller,
  deleteSeller,
  getProductsBySeller
} = require('../controllers/sellers');

const router = express.Router();

// ----------------------
// 2. Routes
// ----------------------

/**
 * @swagger
 * /sellers:
 *   get:
 *     summary: Get all sellers
 *     tags: [Sellers]
 *     responses:
 *       200:
 *         description: List of sellers
 *   post:
 *     summary: Create a new seller
 *     tags: [Sellers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seller_id:
 *                 type: string
 *               seller_name:
 *                 type: string
 *               seller_state:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seller created
 */
router.get('/', getAllSellers); // Get all sellers with pagination
router.post('/', createSeller); // Create a new seller

/**
 * @swagger
 * /sellers/{id}:
 *   get:
 *     summary: Get a seller by ID
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller found
 *   put:
 *     summary: Update a seller
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Seller updated
 *   delete:
 *     summary: Delete a seller
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Seller deleted
 */

router.get('/:id', getSellerById); // Get a single seller
router.put('/:id', updateSeller); // Update a seller
router.delete('/:id', deleteSeller); // Delete a seller

/**
 * @swagger
 * /sellers/{id}/products:
 *   get:
 *     summary: Get products sold by a seller
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products by seller
 */
router.get('/:id/products', getProductsBySeller); // Get products sold by a seller

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
