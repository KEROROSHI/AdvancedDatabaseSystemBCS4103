const { query } = require('../config/db');

class Cart {
  static async getOrCreate(customerId) {
    let { rows } = await query(
      'SELECT * FROM carts WHERE customer_id = $1',
      [customerId]
    );

    if (!rows.length) {
      ({ rows } = await query(
        'INSERT INTO carts (customer_id) VALUES ($1) RETURNING *',
        [customerId]
      ));
    }

    return rows[0];
  }

  static async getItems(cartId) {
    const { rows } = await query(
      `SELECT ci.*, p.description, p.unit_price, p.stock_code 
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       WHERE ci.cart_id = $1`,
      [cartId]
    );
    return rows;
  }

  static async addItem(cartId, productId, quantity = 1) {
    // Check if item already exists in cart
    const existingItem = await query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );

    if (existingItem.rows.length) {
      const { rows } = await query(
        `UPDATE cart_items SET quantity = quantity + $1 
         WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
        [quantity, cartId, productId]
      );
      return rows[0];
    } else {
      const { rows } = await query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) 
         VALUES ($1, $2, $3) RETURNING *`,
        [cartId, productId, quantity]
      );
      return rows[0];
    }
  }

  static async updateItem(cartId, productId, quantity) {
    const { rows } = await query(
      `UPDATE cart_items SET quantity = $1 
       WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
      [quantity, cartId, productId]
    );
    return rows[0];
  }

  static async removeItem(cartId, productId) {
    const { rows } = await query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *',
      [cartId, productId]
    );
    return rows[0];
  }

  static async clear(cartId) {
    await query(
      'DELETE FROM cart_items WHERE cart_id = $1',
      [cartId]
    );
  }
}

module.exports = Cart;