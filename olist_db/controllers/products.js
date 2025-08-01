// controllers/products.js
// This file contains the controller functions for the product API endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// ----------------------
// 2. Controller Functions
// ----------------------

/**
 * @desc    Get all products (paginated)
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM olist_products
      ORDER BY product_id
      LIMIT $1 OFFSET $2
    `;

    const countQuery = 'SELECT COUNT(*) FROM olist_products';

    const [productsResult, countResult] = await Promise.all([
      db.query(query, [limit, offset]),
      db.query(countQuery)
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
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get a specific product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM olist_products WHERE product_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public
 */
const createProduct = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const {
      product_category_name,
      product_name_length,
      product_description_length,
      product_photos_qty,
      product_weight_g,
      product_length_cm,
      product_height_cm,
      product_width_cm,
      stock
    } = req.body;

    const product_id = uuidv4();

    const query = `
      INSERT INTO olist_products (
        product_id,
        product_category_name,
        product_name_length,
        product_description_length,
        product_photos_qty,
        product_weight_g,
        product_length_cm,
        product_height_cm,
        product_width_cm,
        stock
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await client.query(query, [
      product_id,
      product_category_name,
      product_name_length,
      product_description_length,
      product_photos_qty,
      product_weight_g,
      product_length_cm,
      product_height_cm,
      product_width_cm,
      stock || 100 // Default stock value if not provided
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Public
 */
const updateProduct = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;
    const {
      product_category_name,
      product_name_length,
      product_description_length,
      product_photos_qty,
      product_weight_g,
      product_length_cm,
      product_height_cm,
      product_width_cm,
      stock
    } = req.body;

    const query = `
      UPDATE olist_products
      SET
        product_category_name = COALESCE($1, product_category_name),
        product_name_length = COALESCE($2, product_name_length),
        product_description_length = COALESCE($3, product_description_length),
        product_photos_qty = COALESCE($4, product_photos_qty),
        product_weight_g = COALESCE($5, product_weight_g),
        product_length_cm = COALESCE($6, product_length_cm),
        product_height_cm = COALESCE($7, product_height_cm),
        product_width_cm = COALESCE($8, product_width_cm),
        stock = COALESCE($9, stock)
      WHERE product_id = $10
      RETURNING *
    `;

    const result = await client.query(query, [
      product_category_name,
      product_name_length,
      product_description_length,
      product_photos_qty,
      product_weight_g,
      product_length_cm,
      product_height_cm,
      product_width_cm,
      stock,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public
 */
const deleteProduct = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // First, delete related order items to avoid foreign key errors
    await client.query('DELETE FROM olist_order_items WHERE product_id = $1', [id]);

    const result = await client.query('DELETE FROM olist_products WHERE product_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: `Product ${id} and related data deleted successfully.` });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM olist_products
      WHERE product_category_name = $1
      ORDER BY product_id
      LIMIT $2 OFFSET $3
    `;
    const countQuery = 'SELECT COUNT(*) FROM olist_products WHERE product_category_name = $1';

    const [productsResult, countResult] = await Promise.all([
      db.query(query, [category, limit, offset]),
      db.query(countQuery, [category])
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
    console.error('Error fetching products by category:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get products with low stock
 * @route   GET /api/products/low-stock
 * @access  Public
 */
const getProductsWithLowStock = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const LOW_STOCK_THRESHOLD = 20;

    const query = `
      SELECT * FROM olist_products
      WHERE stock < $1
      ORDER BY stock ASC
      LIMIT $2 OFFSET $3
    `;
    const countQuery = 'SELECT COUNT(*) FROM olist_products WHERE stock < $1';

    const [productsResult, countResult] = await Promise.all([
      db.query(query, [LOW_STOCK_THRESHOLD, limit, offset]),
      db.query(countQuery, [LOW_STOCK_THRESHOLD])
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
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ----------------------
// 3. Module Export
// ----------------------
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsWithLowStock
};
