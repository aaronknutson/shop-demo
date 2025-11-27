const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware to verify customer JWT token
 */
const verifyCustomerToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's a customer token
    if (decoded.type !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type',
      });
    }

    // Get customer from database
    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        active: true,
      },
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Customer not found',
      });
    }

    if (!customer.active) {
      return res.status(403).json({
        success: false,
        message: 'Account is disabled',
      });
    }

    // Attach customer to request
    req.customer = customer;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional middleware to verify customer JWT token
 * If token is present and valid, attaches customer to request
 * If no token or invalid token, continues without customer (doesn't block request)
 */
const optionalCustomerAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue without customer
      return next();
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's a customer token
    if (decoded.type !== 'customer') {
      // Wrong token type - continue without customer
      return next();
    }

    // Get customer from database
    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        active: true,
      },
    });

    if (customer && customer.active) {
      // Attach customer to request
      req.customer = customer;
    }

    next();
  } catch (error) {
    // Any error - just continue without customer
    next();
  }
};

module.exports = { verifyCustomerToken, optionalCustomerAuth };
