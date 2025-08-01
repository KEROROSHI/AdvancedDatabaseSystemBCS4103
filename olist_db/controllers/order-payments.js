// controllers/order-payments.js
// This file contains the controller functions for the order payment API endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const db = require('../config/db');

// ----------------------
// 2. Controller Functions
// ----------------------

/**
 * @desc    Get all order payments (paginated)
 * @route   GET /api/payments
 * @access  Public
 */
const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM olist_order_payments
      ORDER BY order_id, payment_sequential
      LIMIT $1 OFFSET $2
    `;
    const countQuery = 'SELECT COUNT(*) FROM olist_order_payments';

    const [paymentsResult, countResult] = await Promise.all([
      db.query(query, [limit, offset]),
      db.query(countQuery)
    ]);

    const totalPayments = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPayments / limit);

    res.status(200).json({
      success: true,
      data: paymentsResult.rows,
      pagination: {
        page,
        limit,
        totalItems: totalPayments,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get payments for a specific order
 * @route   GET /api/payments/:orderId
 * @access  Public
 */
const getPaymentsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const query = 'SELECT * FROM olist_order_payments WHERE order_id = $1 ORDER BY payment_sequential';
    const result = await db.query(query, [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payments for this order not found' });
    }

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching payments by order ID:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Create a new payment record
 * @route   POST /api/payments
 * @access  Public
 */
const createPayment = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const {
      order_id,
      payment_sequential,
      payment_type,
      payment_installments,
      payment_value
    } = req.body;

    // Check if the order_id exists
    const orderCheck = await client.query('SELECT 1 FROM olist_orders WHERE order_id = $1', [order_id]);
    if (orderCheck.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const query = `
      INSERT INTO olist_order_payments (
        order_id,
        payment_sequential,
        payment_type,
        payment_installments,
        payment_value
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await client.query(query, [
      order_id,
      payment_sequential,
      payment_type,
      payment_installments,
      payment_value
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Update a payment record
 * @route   PUT /api/payments/:orderId/:paymentSequential
 * @access  Public
 */
const updatePayment = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { orderId, paymentSequential } = req.params;
    const {
      payment_type,
      payment_installments,
      payment_value
    } = req.body;

    const query = `
      UPDATE olist_order_payments
      SET
        payment_type = COALESCE($1, payment_type),
        payment_installments = COALESCE($2, payment_installments),
        payment_value = COALESCE($3, payment_value)
      WHERE order_id = $4 AND payment_sequential = $5
      RETURNING *
    `;

    const result = await client.query(query, [
      payment_type,
      payment_installments,
      payment_value,
      orderId,
      paymentSequential
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payment record not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Delete a payment record
 * @route   DELETE /api/payments/:orderId/:paymentSequential
 * @access  Public
 */
const deletePayment = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { orderId, paymentSequential } = req.params;

    const result = await client.query('DELETE FROM olist_order_payments WHERE order_id = $1 AND payment_sequential = $2 RETURNING *', [orderId, paymentSequential]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payment record not found' });
    }

    res.status(200).json({ success: true, message: `Payment record ${paymentSequential} for order ${orderId} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

// ----------------------
// 3. Module Export
// ----------------------
module.exports = {
  getAllPayments,
  getPaymentsByOrderId,
  createPayment,
  updatePayment,
  deletePayment
};
