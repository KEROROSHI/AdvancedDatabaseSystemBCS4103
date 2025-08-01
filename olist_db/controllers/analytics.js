// controllers/analytics.js
// This file contains the controller functions for the analytics API endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const db = require('../config/db');

// ----------------------
// 2. Controller Functions
// ----------------------

/**
 * @desc    Get sales data for a specific date range
 * @route   GET /api/analytics/sales
 * @access  Public
 */
const getSalesData = async (req, res) => {
  try {
    const { startDate, endDate, country } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'startDate and endDate are required query parameters' });
    }

    // Call the stored procedure to get sales by period
    const query = `SELECT * FROM get_sales_by_period($1::DATE, $2::DATE, $3::VARCHAR)`;
    const result = await db.query(query, [startDate, endDate, country]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No sales data found for the specified period' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get customer segmentation data
 * @route   GET /api/analytics/customer-segments
 * @access  Public
 */
const getCustomerSegments = async (req, res) => {
  try {
    const query = `
      SELECT segment, COUNT(*) AS count
      FROM olist_customers
      GROUP BY segment
      ORDER BY count DESC
    `;
    const result = await db.query(query);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching customer segments:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get product performance metrics
 * @route   GET /api/analytics/product-performance
 * @access  Public
 */
const getProductPerformance = async (req, res) => {
  try {
    const query = `
      SELECT
        p.product_category_name,
        COUNT(oi.order_item_id) AS total_items_sold,
        SUM(oi.price) AS total_revenue,
        AVG(r.review_score) AS average_review_score
      FROM olist_products p
      JOIN olist_order_items oi ON p.product_id = oi.product_id
      LEFT JOIN olist_order_reviews r ON oi.order_id = r.order_id
      GROUP BY p.product_category_name
      ORDER BY total_revenue DESC
      LIMIT 10
    `;
    const result = await db.query(query);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching product performance:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get sales by geographic location
 * @route   GET /api/analytics/geographic
 * @access  Public
 */
const getGeographicSales = async (req, res) => {
  try {
    const query = `
      SELECT
        c.customer_state,
        c.customer_city,
        COUNT(DISTINCT o.order_id) AS total_orders,
        SUM(oi.price) AS total_revenue
      FROM olist_orders o
      JOIN olist_customers c ON o.customer_id = c.customer_id
      JOIN olist_order_items oi ON o.order_id = oi.order_id
      GROUP BY c.customer_state, c.customer_city
      ORDER BY total_revenue DESC
      LIMIT 10
    `;
    const result = await db.query(query);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching geographic sales:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ----------------------
// 3. Module Export
// ----------------------
module.exports = {
  getSalesData,
  getCustomerSegments,
  getProductPerformance,
  getGeographicSales
};
