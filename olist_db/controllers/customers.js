// controllers/customers.js
// This file contains the controller functions for the customer API endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// ----------------------
// 2. Controller Functions
// ----------------------

/**
 * @desc    Get all customers (paginated)
 * @route   GET /api/customers
 * @access  Public
 */
const getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM olist_customers
      ORDER BY customer_id
      LIMIT $1 OFFSET $2
    `;

    const countQuery = 'SELECT COUNT(*) FROM olist_customers';

    const [customersResult, countResult] = await Promise.all([
      db.query(query, [limit, offset]),
      db.query(countQuery)
    ]);

    const totalCustomers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCustomers / limit);

    res.status(200).json({
      success: true,
      data: customersResult.rows,
      pagination: {
        page,
        limit,
        totalItems: totalCustomers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get a single customer
 * @route   GET /api/customers/:id
 * @access  Public
 */
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM olist_customers WHERE customer_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Create a new customer
 * @route   POST /api/customers
 * @access  Public
 */
const createCustomer = async (req, res) => {
  try {
    const { customer_unique_id, customer_zip_code_prefix, customer_city, customer_state } = req.body;

    // Validate that required fields are present.
    if (!customer_unique_id || !customer_zip_code_prefix || !customer_city || !customer_state) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Generate a new UUID for the customer_id
    const customer_id = uuidv4(); 

    const query = `
      INSERT INTO olist_customers
      (customer_id, customer_unique_id, customer_zip_code_prefix, customer_city, customer_state)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await db.query(query, [
      customer_id,
      customer_unique_id,
      customer_zip_code_prefix,
      customer_city,
      customer_state
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Update a customer
 * @route   PUT /api/customers/:id
 * @access  Public
 */
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_unique_id, customer_zip_code_prefix, customer_city, customer_state } = req.body;

    const query = `
      UPDATE olist_customers
      SET
        customer_unique_id = COALESCE($1, customer_unique_id),
        customer_zip_code_prefix = COALESCE($2, customer_zip_code_prefix),
        customer_city = COALESCE($3, customer_city),
        customer_state = COALESCE($4, customer_state)
      WHERE customer_id = $5
      RETURNING *
    `;

    const result = await db.query(query, [
      customer_unique_id,
      customer_zip_code_prefix,
      customer_city,
      customer_state,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Delete a customer
 * @route   DELETE /api/customers/:id
 * @access  Public
 */
const deleteCustomer = async (req, res) => {
  const client = await db.pool.connect(); // Get a client from the pool

  try {
    const { id } = req.params;

    // Start a transaction
    await client.query('BEGIN');

    // First, delete related records from child tables (e.g., orders)
    await client.query('DELETE FROM olist_orders WHERE customer_id = $1', [id]);

    // Then, delete the customer
    const result = await client.query('DELETE FROM olist_customers WHERE customer_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Commit the transaction
    await client.query('COMMIT');
    res.status(200).json({ success: true, message: `Customer ${id} and all related orders deleted successfully.` });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting customer:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release(); // Release the client back to the pool
  }
};

/**
 * @desc    Get all orders for a customer
 * @route   GET /api/customers/:id/orders
 * @access  Public
 */
const getCustomerOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const customerExists = await db.query('SELECT 1 FROM olist_customers WHERE customer_id = $1', [id]);

    if (customerExists.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    const ordersQuery = `
      SELECT o.*
      FROM olist_orders o
      WHERE o.customer_id = $1
      ORDER BY o.order_purchase_timestamp DESC
      LIMIT $2 OFFSET $3
    `;
    const countQuery = 'SELECT COUNT(*) FROM olist_orders WHERE customer_id = $1';

    const [ordersResult, countResult] = await Promise.all([
      db.query(ordersQuery, [id, limit, offset]),
      db.query(countQuery, [id])
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
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get customers by segment
 * @route   GET /api/customers/segment/:segment
 * @access  Public
 */
const getCustomersBySegment = async (req, res) => {
  try {
    const { segment } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Validate segment
    const validSegments = ['Premium', 'Regular', 'New'];
    if (!validSegments.includes(segment)) {
      return res.status(400).json({
        success: false,
        error: `Invalid segment. Must be one of: ${validSegments.join(', ')}`
      });
    }

    const [customersResult, countResult] = await Promise.all([
      db.query(
        `SELECT * FROM olist_customers
         WHERE segment = $1
         ORDER BY customer_id
         LIMIT $2 OFFSET $3`,
        [segment, limit, offset]
      ),
      db.query(
        `SELECT COUNT(*) FROM olist_customers
         WHERE segment = $1`,
        [segment]
      )
    ]);

    const totalCustomers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCustomers / limit);

    res.status(200).json({
      success: true,
      data: customersResult.rows,
      pagination: {
        page,
        limit,
        totalItems: totalCustomers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching customers by segment:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ----------------------
// 3. Module Export
// ----------------------
module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders,
  getCustomersBySegment
};
