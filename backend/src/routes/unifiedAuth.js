const express = require('express');
const router = express.Router();
const unifiedAuthController = require('../controllers/unifiedAuthController');

// Unified login endpoint
router.post('/login', unifiedAuthController.unifiedLogin);

module.exports = router;
