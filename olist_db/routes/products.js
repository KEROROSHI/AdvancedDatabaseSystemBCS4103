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

// Get all products with pagination
router.get('/', getAllProducts);

// Get products with low stock
router.get('/low-stock', getProductsWithLowStock);

// Get products by category with pagination
router.get('/category/:category', getProductsByCategory);

// Get a single product
router.get('/:id', getProductById);

// Create a new product
router.post('/', createProduct);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
