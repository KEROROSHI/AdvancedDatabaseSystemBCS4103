// routes/customers.js
// This file defines the API routes for customer-related endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders,
  getCustomersBySegment
} = require('../controllers/customers');

// ----------------------
// 2. Route Definitions
// ----------------------

// GET /api/customers - List all customers (paginated)
router.get('/', getAllCustomers);

// GET /api/customers/segment/:segment - Get customers by segment
router.get('/segment/:segment', getCustomersBySegment);

// GET /api/customers/:id/orders - Get all orders for a specific customer
router.get('/:id/orders', getCustomerOrders);

// GET /api/customers/:id - Get a specific customer by ID
router.get('/:id', getCustomerById);

// POST /api/customers - Create a new customer
router.post('/', createCustomer);

// PUT /api/customers/:id - Update a customer by ID
router.put('/:id', updateCustomer);

// DELETE /api/customers/:id - Delete a customer by ID
router.delete('/:id', deleteCustomer);

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
