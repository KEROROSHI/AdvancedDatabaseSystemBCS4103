/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */
// routes/products.js
// This file defines the API routes for products.

// ----------------------
// 1. Module Imports
// ----------------------
const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsWithLowStock
} = require('../controllers/products');

const router = express.Router();

// ----------------------
// 2. Routes
// ----------------------

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, product_category, description]
 *             properties:
 *               product_id:
 *                 type: string
 *               product_category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 */
router.get('/', getAllProducts); // Get all products with pagination
router.post('/', createProduct); // Create a new product

/**
 * @swagger
 * /products/low-stock:
 *   get:
 *     summary: Get products with low stock
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of low-stock products
 */
router.get('/low-stock', getProductsWithLowStock); // Get products with low stock

/**
 * @swagger
 * /products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products in specified category
 */
router.get('/category/:category', getProductsByCategory); // Get products by category with pagination

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 *         description: Product updated
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 */

router.get('/:id', getProductById); // Get a single product
router.put('/:id', updateProduct); // Update a product
router.delete('/:id', deleteProduct); // Delete a product

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
