const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const couponController = require('../controllers/coupon.controller');

/**
 * Get all active coupons
 * GET /api/coupons
 */
router.get('/', asyncHandler(couponController.getActiveCoupons));

/**
 * Get coupon by code
 * GET /api/coupons/:code
 */
router.get('/:code', asyncHandler(couponController.getCouponByCode));

module.exports = router;
