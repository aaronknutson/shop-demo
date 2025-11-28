const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get all active coupons
 */
const getActiveCoupons = async (req, res) => {
  const coupons = await prisma.coupon.findMany({
    where: {
      active: true,
      expiresAt: {
        gte: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.status(200).json({
    success: true,
    count: coupons.length,
    data: coupons
  });
};

/**
 * Get coupon by code
 */
const getCouponByCode = async (req, res) => {
  const { code } = req.params;

  const coupon = await prisma.coupon.findUnique({
    where: {
      code: code.toUpperCase()
    }
  });

  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  if (!coupon.active || coupon.expiresAt < new Date()) {
    throw new AppError('This coupon has expired or is no longer active', 400);
  }

  res.status(200).json({
    success: true,
    data: coupon
  });
};

module.exports = {
  getActiveCoupons,
  getCouponByCode
};
