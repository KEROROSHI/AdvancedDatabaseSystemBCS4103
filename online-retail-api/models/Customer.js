const { query } = require('../config/db');

class Customer {
  static async findAll(limit = 10, offset = 0) {
    const { rows } = await query(
      'SELECT * FROM customers ORDER BY customer_id LIMIT $1 OFFSET $2', 
      [limit, offset]
    );
    return rows;
  }

  static async findById(id) {
    const { rows } = await query(
      'SELECT * FROM customers WHERE customer_id = $1', 
      [id]
    );
    return rows[0];
  }

  static async create(customerData) {
    const { rows } = await query(
      `INSERT INTO customers 
       (customer_name, email, phone, country_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        customerData.customer_name,
        customerData.email,
        customerData.phone,
        customerData.country_id
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
      `UPDATE customers SET ${fields.join(', ')} 
       WHERE customer_id = $${paramCount} RETURNING *`,
      values
    );
    return rows[0];
  }

  static async getOrderHistory(customerId) {
    const { rows } = await query(
      `SELECT o.order_id, o.order_date, o.status, 
              SUM(oi.quantity * oi.unit_price) as total_amount
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.customer_id = $1
       GROUP BY o.order_id`,
      [customerId]
    );
    return rows;
  }
}

module.exports = Customer;