// controllers/order-reviews.js
// This file contains the controller functions for the order review API endpoints.

// ----------------------
// 1. Module Imports
// ----------------------
const db = require('../config/db');

// ----------------------
// 2. Controller Functions
// ----------------------

/**
 * @desc    Get all order reviews (paginated)
 * @route   GET /api/reviews
 * @access  Public
 */
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM olist_order_reviews
      ORDER BY review_creation_date DESC
      LIMIT $1 OFFSET $2
    `;
    const countQuery = 'SELECT COUNT(*) FROM olist_order_reviews';

    const [reviewsResult, countResult] = await Promise.all([
      db.query(query, [limit, offset]),
      db.query(countQuery)
    ]);

    const totalReviews = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalReviews / limit);

    res.status(200).json({
      success: true,
      data: reviewsResult.rows,
      pagination: {
        page,
        limit,
        totalItems: totalReviews,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Get a specific review by review_id
 * @route   GET /api/reviews/:id
 * @access  Public
 */
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM olist_order_reviews WHERE review_id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Public
 */
const createReview = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const {
      review_id,
      order_id,
      review_score,
      review_comment_title,
      review_comment_message,
      review_creation_date,
      review_answer_timestamp
    } = req.body;

    const query = `
      INSERT INTO olist_order_reviews (
        review_id,
        order_id,
        review_score,
        review_comment_title,
        review_comment_message,
        review_creation_date,
        review_answer_timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await client.query(query, [
      review_id,
      order_id,
      review_score,
      review_comment_title,
      review_comment_message,
      review_creation_date,
      review_answer_timestamp
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Public
 */
const updateReview = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;
    const {
      review_score,
      review_comment_title,
      review_comment_message,
      review_answer_timestamp
    } = req.body;

    const query = `
      UPDATE olist_order_reviews
      SET
        review_score = COALESCE($1, review_score),
        review_comment_title = COALESCE($2, review_comment_title),
        review_comment_message = COALESCE($3, review_comment_message),
        review_answer_timestamp = COALESCE($4, review_answer_timestamp)
      WHERE review_id = $5
      RETURNING *
    `;

    const result = await client.query(query, [
      review_score,
      review_comment_title,
      review_comment_message,
      review_answer_timestamp,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Public
 */
const deleteReview = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;

    const result = await client.query('DELETE FROM olist_order_reviews WHERE review_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.status(200).json({ success: true, message: `Review ${id} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
};

/**
 * @desc    Get average review score for last X days
 * @route   GET /api/reviews/average/:days
 * @access  Public
 */
const getAverageReviewScore = async (req, res) => {
  try {
    const days = parseInt(req.params.days) || 30; // Default to 30 days
    const query = `
      SELECT AVG(review_score) AS average_score
      FROM olist_order_reviews
      WHERE review_creation_date >= NOW() - INTERVAL '${days} days'
    `;
    const result = await db.query(query);

    res.status(200).json({
      success: true,
      data: {
        average_score: parseFloat(result.rows[0].average_score).toFixed(2),
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error fetching average review score:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ----------------------
// 3. Module Export
// ----------------------
module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getAverageReviewScore
};
