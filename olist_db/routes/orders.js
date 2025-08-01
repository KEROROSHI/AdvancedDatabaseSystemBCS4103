/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing customer orders
 */
// routes/orders.js
// This file defines the API routes for managing orders.

const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderItems,
  getOrderPayments,
  getOrderReviews
} = require('../controllers/orders');

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *             properties:
 *               customer_id:
 *                 type: string
 *               order_status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.route('/')
  .get(getAllOrders)
  .post(createOrder); // Base route for orders

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A specific order
 *   put:
 *     summary: Update order details
 *     tags: [Orders]
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
 *             properties:
 *               order_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Order deleted successfully
 */
router.route('/:id')
  .get(getOrderById)
  .put(updateOrder)
  .delete(deleteOrder); // Routes for specific order by ID

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update an order's status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */ 
router.patch('/:id/status', updateOrderStatus); // Route for updating an order's status

/**
 * @swagger
 * /orders/{id}/items:
 *   get:
 *     summary: Get items for a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of order items
 */
router.get('/:id/items', getOrderItems); // Routes for getting related order data

/**
 * @swagger
 * /orders/{id}/payments:
 *   get:
 *     summary: Get payments for a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of order payments
 */
router.get('/:id/payments', getOrderPayments);

/**
 * @swagger
 * /orders/{id}/reviews:
 *   get:
 *     summary: Get reviews for a specific order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of order reviews
 */
router.get('/:id/reviews', getOrderReviews);

module.exports = router;
