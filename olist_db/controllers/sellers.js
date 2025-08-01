// controllers/sellers.js
// This file contains the controller functions for the seller API endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// ----------------------
// 2. Controller Functions
// ----------------------

/**
 * @desc    Get all sellers (paginated)
 * @route   GET /api/sellers
 * @access  Public
 */
const getAllSellers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM olist_sellers
      ORDER BY seller_id
      LIMIT $1 OFFSET $2
    `;
    const countQuery = 'SELECT COUNT(*) FROM olist_sellers';

    const [sellersResult, countResult] = await Promise.all([
      db.query(query, [limit, offset]),
      db.query(countQuery)
    ]);

    const totalSellers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalSellers / limit);

    res.status(200).json({
      success: true,
      data: sellersResult.rows,
      pagination: {
        page,
        limit,
        totalItems: totalSellers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get a specific seller
 * @route   GET /api/sellers/:id
 * @access  Public
 */
const getSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM olist_sellers WHERE seller_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching seller:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Create a new seller
 * @route   POST /api/sellers
 * @access  Public
 */
const createSeller = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const {
      seller_zip_code_prefix,
      seller_city,
      seller_state
    } = req.body;

    const seller_id = uuidv4();

    const query = `
      INSERT INTO olist_sellers (
        seller_id,
        seller_zip_code_prefix,
        seller_city,
        seller_state
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await client.query(query, [
      seller_id,
      seller_zip_code_prefix,
      seller_city,
      seller_state
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Update a seller
 * @route   PUT /api/sellers/:id
 * @access  Public
 */
const updateSeller = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;
    const {
      seller_zip_code_prefix,
      seller_city,
      seller_state
    } = req.body;

    const query = `
      UPDATE olist_sellers
      SET
        seller_zip_code_prefix = COALESCE($1, seller_zip_code_prefix),
        seller_city = COALESCE($2, seller_city),
        seller_state = COALESCE($3, seller_state)
      WHERE seller_id = $4
      RETURNING *
    `;

    const result = await client.query(query, [
      seller_zip_code_prefix,
      seller_city,
      seller_state,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating seller:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Delete a seller
 * @route   DELETE /api/sellers/:id
 * @access  Public
 */
const deleteSeller = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // First, delete related order items to avoid foreign key errors
    await client.query('DELETE FROM olist_order_items WHERE seller_id = $1', [id]);

    const result = await client.query('DELETE FROM olist_sellers WHERE seller_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: `Seller ${id} and related data deleted successfully.` });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting seller:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get products sold by a seller
 * @route   GET /api/sellers/:id/products
 * @access  Public
 */
const getProductsBySeller = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT DISTINCT p.*
      FROM olist_products p
      JOIN olist_order_items oi ON p.product_id = oi.product_id
      WHERE oi.seller_id = $1
      ORDER BY p.product_id
      LIMIT $2 OFFSET $3
    `;
    const countQuery = 'SELECT COUNT(DISTINCT product_id) FROM olist_order_items WHERE seller_id = $1';

    const [productsResult, countResult] = await Promise.all([
      db.query(query, [id, limit, offset]),
      db.query(countQuery, [id])
    ]);

    const totalProducts = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      data: productsResult.rows,
      pagination: {
        page,
        limit,
        totalItems: totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products by seller:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ----------------------
// 3. Module Export
// ----------------------
module.exports = {
  getAllSellers,
  getSellerById,
  createSeller,
  updateSeller,
  deleteSeller,
  getProductsBySeller
};
