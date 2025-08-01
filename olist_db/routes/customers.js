/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API endpoints for managing customers
 */
// routes/customers.js
// This file defines the API routes for customer-related endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders,
  getCustomersBySegment
} = require('../controllers/customers');

// ----------------------
// 2. Route Definitions
// ----------------------

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers (paginated)
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of customers
 */
router.get('/', getAllCustomers); // GET /api/customers - List all customers (paginated)

/**
 * @swagger
 * /customers/segment/{segment}:
 *   get:
 *     summary: Get customers by segment (e.g., Premium, Regular, New)
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: segment
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of customers in the given segment
 */
router.get('/segment/:segment', getCustomersBySegment); // GET /api/customers/segment/:segment - Get customers by segment

/**
 * @swagger
 * /customers/{id}/orders:
 *   get:
 *     summary: Get all orders for a specific customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders for the customer
 */
router.get('/:id/orders', getCustomerOrders); // GET /api/customers/:id/orders - Get all orders for a specific customer

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A customer object
 */
router.get('/:id', getCustomerById); // GET /api/customers/:id - Get a specific customer by ID

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               segment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 */
router.post('/', createCustomer); // POST /api/customers - Create a new customer

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update a customer's details
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated
 */
router.put('/:id', updateCustomer); // PUT /api/customers/:id - Update a customer by ID

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Customer deleted
 */
router.delete('/:id', deleteCustomer); // DELETE /api/customers/:id - Delete a customer by ID

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
