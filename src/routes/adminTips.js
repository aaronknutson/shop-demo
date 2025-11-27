const express = require('express');
const router = express.Router();
const {
  getAllTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip,
  togglePublished,
  getTipStats
} = require('../controllers/adminTipsController');
const { authenticateAdmin } = require('../middleware/auth');

// All routes are protected and admin-only
router.use(authenticateAdmin);

// Statistics
router.get('/stats', getTipStats);

// CRUD operations
router.get('/', getAllTips);
router.get('/:id', getTipById);
router.post('/', createTip);
router.put('/:id', updateTip);
router.delete('/:id', deleteTip);

// Toggle published status
router.patch('/:id/toggle-published', togglePublished);

module.exports = router;
