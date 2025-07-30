const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// GET products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, inStock, search } = req.query;
    let queryStr = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category) {
      queryStr += ` AND p.category_id = $${paramCount++}`;
      params.push(category);
    }

    if (minPrice) {
      queryStr += ` AND p.unit_price >= $${paramCount++}`;
      params.push(minPrice);
    }

    if (maxPrice) {
      queryStr += ` AND p.unit_price <= $${paramCount++}`;
      params.push(maxPrice);
    }

    if (inStock === 'true') {
      queryStr += ` AND p.stock_quantity > 0`;
    }

    if (search) {
      queryStr += ` AND (p.description ILIKE $${paramCount} OR p.stock_code ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    queryStr += ' ORDER BY p.product_id';

    const { rows } = await query(queryStr, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET product details
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.product_id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new product
router.post('/', async (req, res) => {
  try {
    const { stock_code, description, category_id, unit_price, stock_quantity } = req.body;
    
    const { rows } = await query(
      `INSERT INTO products 
       (stock_code, description, category_id, unit_price, stock_quantity) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [stock_code, description, category_id, unit_price, stock_quantity]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { stock_code, description, category_id, unit_price, stock_quantity } = req.body;

    const { rows } = await query(
      `UPDATE products SET 
       stock_code = $1, 
       description = $2, 
       category_id = $3, 
       unit_price = $4, 
       stock_quantity = $5,
       updated_at = NOW()
       WHERE product_id = $6 RETURNING *`,
      [stock_code, description, category_id, unit_price, stock_quantity, productId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await query(
      'DELETE FROM products WHERE product_id = $1 RETURNING *',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;