const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders (with optional filtering)
router.get('/', orderController.getAllOrders);

// GET a single order by ID
router.get('/:id', orderController.getOrderById);

// POST a new order
router.post('/', orderController.createOrder);

// PUT update order status
router.put('/:id/status', orderController.updateOrderStatus);

// DELETE an order
router.delete('/:id', orderController.cancelOrder);

module.exports = router;