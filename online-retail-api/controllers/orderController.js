const Order = require('../models/Order');
const { query } = require('../config/db');

// Get all orders with pagination and filtering
exports.getAllOrders = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      customerId: req.query.customerId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0
    };

    const orders = await Order.findAll(filters);
    const total = (await Order.findAll()).length;
    
    res.json({
      data: orders,
      meta: {
        page: Math.floor(filters.offset / filters.limit) + 1,
        limit: filters.limit,
        total,
        pages: Math.ceil(total / filters.limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.items || !Array.isArray(req.body.items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.updateStatus(
      req.params.id, 
      req.body.status
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const cancelledOrder = await Order.cancel(req.params.id);
    if (!cancelledOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const { query } = require('../config/db');

// exports.getAllOrders = async (req, res, next) => {
//   try {
//     const { rows } = await query(`
//       SELECT o.*, c.customer_name 
//       FROM orders o
//       JOIN customers c ON o.customer_id = c.customer_id
//       ORDER BY o.order_date DESC
//     `);
//     res.json(rows);
//   } catch (err) {
//     next(err);
//   }
// };

// Implement other order operations similarly...