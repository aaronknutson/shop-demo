const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateAdmin, requireSuperAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);

// Protected routes (require authentication)
router.get('/profile', authenticateAdmin, authController.getProfile);
router.post('/change-password', authenticateAdmin, authController.changePassword);

// Super admin only routes
router.post('/create-admin', authenticateAdmin, requireSuperAdmin, authController.createAdmin);
router.get('/admins', authenticateAdmin, requireSuperAdmin, authController.listAdmins);

module.exports = router;
