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

// Get all sellers with pagination
router.get('/', getAllSellers);

// Get a single seller
router.get('/:id', getSellerById);

// Create a new seller
router.post('/', createSeller);

// Update a seller
router.put('/:id', updateSeller);

// Delete a seller
router.delete('/:id', deleteSeller);

// Get products sold by a seller
router.get('/:id/products', getProductsBySeller);

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
