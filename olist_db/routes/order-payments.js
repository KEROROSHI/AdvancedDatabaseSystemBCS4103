/**
 * @swagger
 * tags:
 *   name: OrderPayments
 *   description: API endpoints for managing order payments
 */
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

/**
 * @swagger
 * /order-payments:
 *   get:
 *     summary: Get all payments with pagination
 *     tags: [OrderPayments]
 *     parameters:
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
 *         description: List of all payments
 */
router.get('/', getAllPayments); // Get all payments with pagination

/**
 * @swagger
 * /order-payments/{orderId}:
 *   get:
 *     summary: Get all payments for a specific order
 *     tags: [OrderPayments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payments for a specific order
 */
router.get('/:orderId', getPaymentsByOrderId); // Get a specific order's payments

/**
 * @swagger
 * /order-payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [OrderPayments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - payment_sequential
 *               - payment_type
 *               - payment_value
 *             properties:
 *               order_id:
 *                 type: string
 *               payment_sequential:
 *                 type: integer
 *               payment_type:
 *                 type: string
 *               payment_value:
 *                 type: number
 *     responses:
 *       201:
 *         description: Payment created successfully
 */
router.post('/', createPayment); // Create a new payment record

/**
 * @swagger
 * /order-payments/{orderId}/{paymentSequential}:
 *   put:
 *     summary: Update a payment record using composite key
 *     tags: [OrderPayments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: paymentSequential
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_type:
 *                 type: string
 *               payment_value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment updated successfully
 */
router.put('/:orderId/:paymentSequential', updatePayment); // Update a payment record (note: uses composite key)

/**
 * @swagger
 * /order-payments/{orderId}/{paymentSequential}:
 *   delete:
 *     summary: Delete a payment record using composite key
 *     tags: [OrderPayments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: paymentSequential
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Payment deleted successfully
 */
router.delete('/:orderId/:paymentSequential', deletePayment); // Delete a payment record (note: uses composite key)

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
