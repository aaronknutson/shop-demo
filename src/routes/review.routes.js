const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const reviewController = require('../controllers/review.controller');

/**
 * Get all approved reviews
 * GET /api/reviews
 */
router.get('/', asyncHandler(reviewController.getApprovedReviews));

module.exports = router;
