const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const contactController = require('../controllers/contact.controller');

/**
 * Submit contact form
 * POST /api/contact
 */
router.post('/', asyncHandler(contactController.submitContactForm));

module.exports = router;
