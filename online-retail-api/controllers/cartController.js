const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.getOrCreate(req.user.customer_id);
    const items = await Cart.getItems(cart.cart_id);
    
    // Calculate total
    let total = 0;
    const detailedItems = items.map(item => {
      const itemTotal = item.quantity * item.unit_price;
      total += itemTotal;
      return { ...item, item_total: itemTotal };
    });

    res.json({
      cart_id: cart.cart_id,
      items: detailedItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    
    // Check product exists and has stock
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const cart = await Cart.getOrCreate(req.user.customer_id);
    const item = await Cart.addItem(cart.cart_id, product_id, quantity);
    
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    
    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be positive' });
    }

    const cart = await Cart.getOrCreate(req.user.customer_id);
    const item = await Cart.updateItem(cart.cart_id, productId, quantity);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.getOrCreate(req.user.customer_id);
    const item = await Cart.removeItem(cart.cart_id, productId);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.getOrCreate(req.user.customer_id);
    const items = await Cart.getItems(cart.cart_id);
    
    if (items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock for all items
    for (const item of items) {
      const inStock = await Product.checkStock(item.product_id, item.quantity);
      if (!inStock) {
        return res.status(400).json({ 
          error: `Product ${item.stock_code} doesn't have enough stock` 
        });
      }
    }

    // Create order
    const order = await Order.create({
      customer_id: req.user.customer_id,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    });

    // Clear cart
    await Cart.clear(cart.cart_id);
    
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};