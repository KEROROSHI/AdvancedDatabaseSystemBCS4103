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

// Base route for orders
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

// Routes for specific order by ID
router.route('/:id')
  .get(getOrderById)
  .put(updateOrder)
  .delete(deleteOrder);

// Route for updating an order's status
router.patch('/:id/status', updateOrderStatus);

// Routes for getting related order data
router.get('/:id/items', getOrderItems);
router.get('/:id/payments', getOrderPayments);
router.get('/:id/reviews', getOrderReviews);

module.exports = router;
