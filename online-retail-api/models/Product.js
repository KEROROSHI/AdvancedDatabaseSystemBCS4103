const { query } = require('../config/db');

class Product {
  static async findAll(filters = {}) {
    let sql = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.category) {
      sql += ` AND p.category_id = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    if (filters.minPrice) {
      sql += ` AND p.unit_price >= $${paramCount}`;
      params.push(filters.minPrice);
      paramCount++;
    }

    if (filters.maxPrice) {
      sql += ` AND p.unit_price <= $${paramCount}`;
      params.push(filters.maxPrice);
      paramCount++;
    }

    if (filters.inStock) {
      sql += ` AND p.stock_quantity > 0`;
    }

    if (filters.search) {
      sql += ` AND (p.description ILIKE $${paramCount} OR p.stock_code ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters.limit) {
      sql += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      sql += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
      paramCount++;
    }

    const { rows } = await query(sql, params);
    return rows;
  }

  static async findById(id) {
    const { rows } = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.product_id = $1`,
      [id]
    );
    return rows[0];
  }

  static async create(productData) {
    const { rows } = await query(
      `INSERT INTO products 
       (stock_code, description, category_id, unit_price, stock_quantity) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        productData.stock_code,
        productData.description,
        productData.category_id,
        productData.unit_price,
        productData.stock_quantity
      ]
    );
    return rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    values.push(id);
    const { rows } = await query(
      `UPDATE products SET ${fields.join(', ')} 
       WHERE product_id = $${paramCount} RETURNING *`,
      values
    );
    return rows[0];
  }

  static async delete(id) {
    const { rows } = await query(
      'DELETE FROM products WHERE product_id = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }

  static async checkStock(productId, quantity) {
    const { rows } = await query(
      'SELECT stock_quantity FROM products WHERE product_id = $1',
      [productId]
    );
    return rows[0]?.stock_quantity >= quantity;
  }
}

module.exports = Product;