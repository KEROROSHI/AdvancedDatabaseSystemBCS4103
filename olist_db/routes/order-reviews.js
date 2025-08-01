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

// Get all reviews with pagination
router.get('/', getAllReviews);

// Get average review score for last X days
router.get('/average/:days', getAverageReviewScore);

// Get a specific review by review_id
router.get('/:id', getReviewById);

// Create a new review
router.post('/', createReview);

// Update a review
router.put('/:id', updateReview);

// Delete a review
router.delete('/:id', deleteReview);

// ----------------------
// 3. Module Export
// ----------------------
module.exports = router;
