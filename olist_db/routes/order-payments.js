// routes/order-payments.js
// This file defines the API routes for order payments.

// ----------------------
// 1. Module Imports
// ----------------------
const express = require('express');
const {
  getAllPayments,
  getPaymentsByOrderId,
  createPayment,
  updatePayment,
  deletePayment
} = require('../controllers/order-payments');

const router = express.Router();

// ----------------------
// 2. Routes
// ----------------------

// Get all payments with pagination
router.get('/', getAllPayments);

// Get a specific order's payments
router.get('/:orderId', getPaymentsByOrderId);

// Create a new payment record
router.post('/', createPayment);

// Update a payment record (note: uses composite key)
router.put('/:orderId/:paymentSequential', updatePayment);

// Delete a payment record (note: uses composite key)
router.delete('/:orderId/:paymentSequential', deletePayment);

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
