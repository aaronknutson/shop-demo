const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const quoteController = require('../controllers/quote.controller');

/**
 * Submit quote request
 * POST /api/quote
 */
router.post('/', asyncHandler(quoteController.submitQuoteRequest));

module.exports = router;
