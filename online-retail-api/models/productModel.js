const pool = require('../config/db');

const getAllProducts = async () => {
  const query = `
    SELECT 
      p.product_id,
      p.stock_code,
      p.description,
      c.name as category_name,
      p.unit_price::numeric,
      p.stock_quantity,
      p.reorder_level
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.product_id`;
  
  const { rows } = await pool.query(query);
  
  // Convert numeric fields to proper JavaScript numbers
  return rows.map(row => ({
    ...row,
    unit_price: parseFloat(row.unit_price),
    stock_quantity: parseInt(row.stock_quantity, 10),
    reorder_level: parseInt(row.reorder_level, 10)
  }));
};

const getProductById = async (id) => {
  const query = `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.product_id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const createProduct = async (productData) => {
  const { stock_code, description, category_id, unit_price, stock_quantity, reorder_level, supplier_info, weight, dimensions } = productData;
  
  const query = `
    INSERT INTO products (
      stock_code, description, category_id, unit_price, 
      stock_quantity, reorder_level, supplier_info, weight, dimensions
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`;
  
  const values = [
    stock_code, description, category_id, unit_price, 
    stock_quantity, reorder_level || 10, supplier_info, weight, dimensions
  ];
  
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateProduct = async (id, productData) => {
  const { stock_code, description, category_id, unit_price, stock_quantity, reorder_level, supplier_info, weight, dimensions } = productData;
  
  const query = `
    UPDATE products 
    SET 
      stock_code = $1,
      description = $2,
      category_id = $3,
      unit_price = $4,
      stock_quantity = $5,
      reorder_level = $6,
      supplier_info = $7,
      weight = $8,
      dimensions = $9,
      updated_at = CURRENT_TIMESTAMP
    WHERE product_id = $10
    RETURNING *`;
  
  const values = [
    stock_code, description, category_id, unit_price, 
    stock_quantity, reorder_level, supplier_info, weight, dimensions, id
  ];
  
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE product_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};