const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auto Shop Demo API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Detailed health check
 * GET /health/detailed
 */
router.get('/detailed', async (req, res) => {
  const healthcheck = {
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    services: {
      database: 'connected', // Will be updated when Prisma is integrated
      email: 'configured'
    }
  };

  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.success = false;
    healthcheck.message = error.message;
    res.status(503).json(healthcheck);
  }
});

module.exports = router;
