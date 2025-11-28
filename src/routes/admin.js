const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateAdmin);

// Dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Quotes management
router.get('/quotes', adminController.getAllQuotes);
router.get('/quotes/:id', adminController.getQuoteById);
router.patch('/quotes/:id/status', adminController.updateQuoteStatus);
router.delete('/quotes/:id', adminController.deleteQuote);

// Reviews management
router.get('/reviews', adminController.getAllReviews);
router.patch('/reviews/:id/approval', adminController.updateReviewApproval);
router.delete('/reviews/:id', adminController.deleteReview);

// Coupons management
router.get('/coupons', adminController.getAllCoupons);
router.post('/coupons', adminController.createCoupon);
router.patch('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// Contacts management
router.get('/contacts', adminController.getAllContacts);
router.delete('/contacts/:id', adminController.deleteContact);

module.exports = router;
