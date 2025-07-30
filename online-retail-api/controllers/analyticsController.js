const { query } = require('../config/db');

exports.getSalesSummary = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    let interval = 'day';
    
    if (period === 'monthly') {
      interval = 'month';
    }

    const { rows } = await query(
      `SELECT 
         DATE_TRUNC('${interval}', order_date) as period,
         COUNT(*) as order_count,
         SUM(total_amount) as total_sales
       FROM orders
       WHERE status = 'completed'
       GROUP BY period
       ORDER BY period DESC`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const { rows } = await query(
      `SELECT 
         p.product_id,
         p.description,
         p.stock_code,
         SUM(oi.quantity) as total_sold,
         SUM(oi.quantity * oi.unit_price) as total_revenue
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
};

exports.getCustomerSegments = async (req, res) => {
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
};