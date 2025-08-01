/**
 * @swagger
 * tags:
 *   name: OrderReviews
 *   description: API endpoints for managing order reviews
 */
// routes/order-reviews.js
// This file defines the API routes for order reviews.

// ----------------------
// 1. Module Imports
// ----------------------
const express = require('express');
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getAverageReviewScore
} = require('../controllers/order-reviews');

const router = express.Router();

// ----------------------
// 2. Routes
// ----------------------

/**
 * @swagger
 * /order-reviews:
 *   get:
 *     summary: Get all reviews with pagination
 *     tags: [OrderReviews]
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
 *         description: List of reviews
 */
router.get('/', getAllReviews); // Get all reviews with pagination

/**
 * @swagger
 * /order-reviews/average/{days}:
 *   get:
 *     summary: Get average review score over the last X days
 *     tags: [OrderReviews]
 *     parameters:
 *       - in: path
 *         name: days
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Average review score
 */
router.get('/average/:days', getAverageReviewScore); // Get average review score for last X days

/**
 * @swagger
 * /order-reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [OrderReviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single review object
 */
router.get('/:id', getReviewById); // Get a specific review by review_id

/**
 * @swagger
 * /order-reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [OrderReviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review_id
 *               - order_id
 *               - review_score
 *             properties:
 *               review_id:
 *                 type: string
 *               order_id:
 *                 type: string
 *               review_score:
 *                 type: integer
 *               review_comment_title:
 *                 type: string
 *               review_comment_message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.post('/', createReview); // Create a new review

/**
 * @swagger
 * /order-reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [OrderReviews]
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
 *               review_score:
 *                 type: integer
 *               review_comment_title:
 *                 type: string
 *               review_comment_message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router.put('/:id', updateReview); // Update a review

/**
 * @swagger
 * /order-reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [OrderReviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 */
router.delete('/:id', deleteReview); // Delete a review

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
