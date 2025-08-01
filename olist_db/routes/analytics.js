/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Endpoints for sales, customer, product, and geographic analytics
 */
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

/**
 * @swagger
 * /analytics/sales:
 *   get:
 *     summary: Get sales data filtered by date range and country
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional country filter
 *     responses:
 *       200:
 *         description: Sales metrics summary
 */ 
router.get('/sales', getSalesData); // Get sales data with date range and country filters


/**
 * @swagger
 * /analytics/customer-segments:
 *   get:
 *     summary: Get customer segmentation metrics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Customer segment analysis
 */
router.get('/customer-segments', getCustomerSegments); // Get customer segmentation data

/**
 * @swagger
 * /analytics/product-performance:
 *   get:
 *     summary: Get product sales and performance analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Optional limit for top-performing products
 *     responses:
 *       200:
 *         description: Product performance data
 */
router.get('/product-performance', getProductPerformance); // Get product performance metrics

/**
 * @swagger
 * /analytics/geographic:
 *   get:
 *     summary: Get sales data by customer geography
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Geographic distribution of sales
 */
router.get('/geographic', getGeographicSales); // Get sales by geographic location

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
