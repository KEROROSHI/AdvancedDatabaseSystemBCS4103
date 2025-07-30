const { query, pool } = require('../config/db'); // Single import statement

class Order {
  static async findAll(filters = {}) {
    let sql = `SELECT o.*, c.customer_name 
               FROM orders o 
               JOIN customers c ON o.customer_id = c.customer_id 
               WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    if (filters.status) {
      sql += ` AND o.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.customerId) {
      sql += ` AND o.customer_id = $${paramCount}`;
      params.push(filters.customerId);
      paramCount++;
    }

    if (filters.startDate) {
      sql += ` AND o.order_date >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      sql += ` AND o.order_date <= $${paramCount}`;
      params.push(filters.endDate);
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
    const orderQuery = await query(
      `SELECT o.*, c.customer_name, c.email, c.phone 
       FROM orders o 
       JOIN customers c ON o.customer_id = c.customer_id 
       WHERE o.order_id = $1`,
      [id]
    );

    if (!orderQuery.rows[0]) {
      return null;
    }

    const itemsQuery = await query(
      `SELECT oi.*, p.description, p.stock_code 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.product_id 
       WHERE oi.order_id = $1`,
      [id]
    );

    return {
      ...orderQuery.rows[0],
      items: itemsQuery.rows
    };
  }

  static async create(orderData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Validate required fields
    if (!orderData.invoice_no) throw new Error('Invoice number required');
    if (!orderData.customer_id) throw new Error('Customer ID required');
    if (!orderData.items?.length) throw new Error('At least one item required');

    // Calculate order totals
    let totalAmount = 0;
    let totalItems = 0;
    
    for (const item of orderData.items) {
      const product = await client.query(
        'SELECT unit_price FROM products WHERE product_id = $1 FOR UPDATE',
        [item.product_id]
      );
      
      if (!product.rows[0]) throw new Error(`Product ${item.product_id} not found`);
      
      // Calculate line total
      item.line_total = product.rows[0].unit_price * item.quantity;
      totalAmount += item.line_total;
      totalItems += item.quantity;
    }

    // Create order
    const { rows } = await client.query(
      `INSERT INTO orders 
       (customer_id, invoice_no, total_amount, total_items, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        orderData.customer_id,
        orderData.invoice_no,
        totalAmount,
        totalItems,
        orderData.status || 'pending'
      ]
    );

    // Add order items with line_total
    for (const item of orderData.items) {
      await client.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, unit_price, line_total) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          rows[0].order_id,
          item.product_id,
          item.quantity,
          item.unit_price || product.rows[0].unit_price,
          item.line_total  // This is now calculated
        ]
      );

      // Update stock
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

  static async updateStatus(id, status) {
    const { rows } = await query(
      'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
      [status, id]
    );
    return rows[0];
  }

  static async cancel(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get order items first
      const { rows: items } = await client.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
        [id]
      );

      // Restore stock
      for (const item of items) {
        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE product_id = $2',
          [item.quantity, item.product_id]
        );
      }

      // Cancel order
      const { rows } = await client.query(
        'DELETE FROM orders WHERE order_id = $1 RETURNING *',
        [id]
      );

      await client.query('COMMIT');
      return rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = Order;