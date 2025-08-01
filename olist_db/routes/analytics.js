// routes/analytics.js
// This file defines the API routes for analytics endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const express = require('express');
const {
  getSalesData,
  getCustomerSegments,
  getProductPerformance,
  getGeographicSales
} = require('../controllers/analytics');

const router = express.Router();

// ----------------------
// 2. Routes
// ----------------------

// Get sales data with date range and country filters
router.get('/sales', getSalesData);

// Get customer segmentation data
router.get('/customer-segments', getCustomerSegments);

// Get product performance metrics
router.get('/product-performance', getProductPerformance);

// Get sales by geographic location
router.get('/geographic', getGeographicSales);

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
