const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// GET all customers with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countQuery = await query('SELECT COUNT(*) FROM customers');
    const total = parseInt(countQuery.rows[0].count);

    const { rows } = await query(
      'SELECT * FROM customers ORDER BY customer_id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      data: rows,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET customer profile with order history
router.get('/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    
    // Get customer details
    const customerQuery = await query(
      'SELECT * FROM customers WHERE customer_id = $1',
      [customerId]
    );
    
    if (customerQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get order history
    const ordersQuery = await query(
      `SELECT o.*, COUNT(oi.id) as item_count 
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.customer_id = $1
       GROUP BY o.order_id`,
      [customerId]
    );

    res.json({
      ...customerQuery.rows[0],
      orders: ordersQuery.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST register new customer
router.post('/', async (req, res) => {
  try {
    const { customer_id, customer_name, email, phone, country_id } = req.body;
    
    if (!customer_id) {
      return res.status(400).json({ error: "customer_id is required" });
    }

    const { rows } = await query(
      `INSERT INTO customers 
       (customer_id, customer_name, email, phone, country_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_id, customer_name, email, phone, country_id]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update customer information
router.put('/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const { customer_name, email, phone, country_id } = req.body;

    const { rows } = await query(
      `UPDATE customers SET 
       customer_name = $1, 
       email = $2, 
       phone = $3, 
       country_id = $4,
       updated_at = NOW()
       WHERE customer_id = $5 RETURNING *`,
      [customer_name, email, phone, country_id, customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET customer's order history
router.get('/:id/orders', async (req, res) => {
  try {
    const customerId = req.params.id;
    
    const { rows } = await query(
      `SELECT o.*, 
       COUNT(oi.id) as item_count,
       SUM(oi.line_total) as order_total
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.customer_id = $1
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`,
      [customerId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;