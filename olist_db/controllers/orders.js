// controllers/orders.js
// This file contains the controller functions for the order API endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// ----------------------
// 2. Controller Functions
// ----------------------

/**
 * @desc    Get all orders (paginated)
 * @route   GET /api/orders
 * @access  Public
 */
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM olist_orders
      ORDER BY order_purchase_timestamp DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = 'SELECT COUNT(*) FROM olist_orders';

    const [ordersResult, countResult] = await Promise.all([
      db.query(query, [limit, offset]),
      db.query(countQuery)
    ]);

    const totalOrders = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      data: ordersResult.rows,
      pagination: {
        page,
        limit,
        totalItems: totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get a specific order
 * @route   GET /api/orders/:id
 * @access  Public
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM olist_orders WHERE order_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const {
      customer_id,
      order_status,
      order_approved_at,
      order_delivered_carrier_date,
      order_delivered_customer_date,
      order_estimated_delivery_date,
      items, // array of { product_id, seller_id, price, freight_value }
      payments, // array of { payment_sequential, payment_type, payment_installments, payment_value }
      reviews // array of { review_score, review_comment_title, review_comment_message }
    } = req.body;

    await client.query('BEGIN');

    // 1. Create the order
    const order_id = uuidv4();
    const order_purchase_timestamp = new Date();

    const orderQuery = `
      INSERT INTO olist_orders
      (order_id, customer_id, order_status, order_purchase_timestamp, order_approved_at, order_delivered_carrier_date, order_delivered_customer_date, order_estimated_delivery_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const orderResult = await client.query(orderQuery, [
      order_id,
      customer_id,
      order_status || 'created',
      order_purchase_timestamp,
      order_approved_at,
      order_delivered_carrier_date,
      order_delivered_customer_date,
      order_estimated_delivery_date
    ]);

    // 2. Insert order items
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemQuery = `
          INSERT INTO olist_order_items
          (order_id, order_item_id, product_id, seller_id, price, freight_value)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await client.query(itemQuery, [
          order_id,
          i + 1, // order_item_id
          item.product_id,
          item.seller_id,
          item.price,
          item.freight_value
        ]);
      }
    }

    // 3. Insert order payments
    if (payments && payments.length > 0) {
      for (const payment of payments) {
        const paymentQuery = `
          INSERT INTO olist_order_payments
          (order_id, payment_sequential, payment_type, payment_installments, payment_value)
          VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(paymentQuery, [
          order_id,
          payment.payment_sequential,
          payment.payment_type,
          payment.payment_installments,
          payment.payment_value
        ]);
      }
    }

    // 4. Insert order reviews
    if (reviews && reviews.length > 0) {
      for (const review of reviews) {
        const review_id = uuidv4();
        const reviewQuery = `
          INSERT INTO olist_order_reviews
          (review_id, order_id, review_score, review_comment_title, review_comment_message, review_creation_date)
          VALUES ($1, $2, $3, $4, $5, NOW())
        `;
        await client.query(reviewQuery, [
          review_id,
          order_id,
          review.review_score,
          review.review_comment_title,
          review.review_comment_message
        ]);
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: orderResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Update an order
 * @route   PUT /api/orders/:id
 * @access  Public
 */
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_id,
      order_status,
      order_approved_at,
      order_delivered_carrier_date,
      order_delivered_customer_date,
      order_estimated_delivery_date
    } = req.body;

    const query = `
      UPDATE olist_orders
      SET
        customer_id = COALESCE($1, customer_id),
        order_status = COALESCE($2, order_status),
        order_approved_at = COALESCE($3, order_approved_at),
        order_delivered_carrier_date = COALESCE($4, order_delivered_carrier_date),
        order_delivered_customer_date = COALESCE($5, order_delivered_customer_date),
        order_estimated_delivery_date = COALESCE($6, order_estimated_delivery_date)
      WHERE order_id = $7
      RETURNING *
    `;

    const result = await db.query(query, [
      customer_id,
      order_status,
      order_approved_at,
      order_delivered_carrier_date,
      order_delivered_customer_date,
      order_estimated_delivery_date,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Public
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
      return res.status(400).json({ success: false, error: 'Order status is required' });
    }

    const query = `
      UPDATE olist_orders
      SET order_status = $1
      WHERE order_id = $2
      RETURNING *
    `;

    const result = await db.query(query, [order_status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Delete an order
 * @route   DELETE /api/orders/:id
 * @access  Public
 */
const deleteOrder = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // Delete from child tables first to avoid foreign key constraints
    await client.query('DELETE FROM olist_order_items WHERE order_id = $1', [id]);
    await client.query('DELETE FROM olist_order_payments WHERE order_id = $1', [id]);
    await client.query('DELETE FROM olist_order_reviews WHERE order_id = $1', [id]);

    const result = await client.query('DELETE FROM olist_orders WHERE order_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: `Order ${id} and related data deleted successfully.` });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get items for an order
 * @route   GET /api/orders/:id/items
 * @access  Public
 */
const getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM olist_order_items WHERE order_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Items not found for this order' });
    }

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get payments for an order
 * @route   GET /api/orders/:id/payments
 * @access  Public
 */
const getOrderPayments = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM olist_order_payments WHERE order_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payments not found for this order' });
    }

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching order payments:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get reviews for an order
 * @route   GET /api/orders/:id/reviews
 * @access  Public
 */
const getOrderReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM olist_order_reviews WHERE order_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Reviews not found for this order' });
    }

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching order reviews:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ----------------------
// 3. Module Export
// ----------------------
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderItems,
  getOrderPayments,
  getOrderReviews
};
