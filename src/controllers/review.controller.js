const { PrismaClient } = require('@prisma/client');
const logger = require('../config/logger');

const prisma = new PrismaClient();

/**
 * Get all approved reviews
 */
const getApprovedReviews = async (req, res) => {
  const { page = 1, limit = 10, service } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {
    approved: true,
    ...(service && { service })
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take
    }),
    prisma.review.count({ where })
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / take),
    data: reviews
  });
};

module.exports = {
  getApprovedReviews
};
