const express = require('express');
const router = express.Router();

const productRoutes = require('./products');
const customerRoutes = require('./customers');
const orderRoutes = require('./orders');
const authRoutes = require('./auth');

router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);

module.exports = router;