const express = require('express');
const router = express.Router();
const {
  getAllPublishedTips,
  getTipBySlug,
  getCategories
} = require('../controllers/tipsController');

// Public routes
router.get('/', getAllPublishedTips);
router.get('/categories', getCategories);
router.get('/:slug', getTipBySlug);

module.exports = router;
