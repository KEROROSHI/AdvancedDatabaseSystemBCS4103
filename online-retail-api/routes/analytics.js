const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// GET daily/monthly sales summary
router.get('/sales-summary', async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    const interval = period === 'monthly' ? 'month' : 'day';
    
    const { rows } = await query(
      `SELECT 
         DATE_TRUNC('${interval}', order_date) as period,
         COUNT(*) as order_count,
         SUM(total_amount) as total_sales,
         AVG(total_amount) as avg_order_value
       FROM orders
       WHERE status = 'completed'
       GROUP BY period
       ORDER BY period DESC`
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET best selling products
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const { rows } = await query(
      `SELECT 
         p.product_id,
         p.stock_code,
         p.description,
         SUM(oi.quantity) as total_sold,
         SUM(oi.line_total) as total_revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       JOIN orders o ON oi.order_id = o.order_id
       WHERE o.status = 'completed'
       GROUP BY p.product_id
       ORDER BY total_sold DESC
       LIMIT $1`,
      [limit]
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET customer analysis
router.get('/customer-segments', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT 
         customer_segment,
         COUNT(*) as customer_count,
         AVG(total_spent) as avg_spending,
         AVG(total_orders) as avg_orders
       FROM customers
       GROUP BY customer_segment`
    );
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;