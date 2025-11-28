const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const yup = require('yup');

const prisma = new PrismaClient();

// Validation schema for login
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

/**
 * Unified login that checks both admin and customer accounts
 * Returns user type and appropriate redirect path
 */
exports.unifiedLogin = async (req, res) => {
  try {
    const validatedData = await loginSchema.validate(req.body);
    const { email, password } = validatedData;

    // First, check if it's an admin account
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (admin && admin.active) {
      // Verify admin password
      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (isValidPassword) {
        // Generate JWT for admin
        const token = jwt.sign(
          { id: admin.id, email: admin.email, type: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            userType: 'admin',
            redirectTo: '/admin/dashboard',
            user: {
              id: admin.id,
              email: admin.email,
              username: admin.username,
              role: admin.role,
            },
            token,
          },
        });
      }
    }

    // If not admin or wrong password, check customer account
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (customer) {
      // Check if customer is active
      if (!customer.active) {
        return res.status(403).json({
          success: false,
          message: 'Account is disabled. Please contact support.',
        });
      }

      // Verify customer password
      const isValidPassword = await bcrypt.compare(password, customer.password);

      if (isValidPassword) {
        // Generate JWT for customer
        const token = jwt.sign(
          { id: customer.id, email: customer.email, type: 'customer' },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        );

        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            userType: 'customer',
            redirectTo: '/portal/dashboard',
            user: {
              id: customer.id,
              email: customer.email,
              firstName: customer.firstName,
              lastName: customer.lastName,
              phone: customer.phone,
            },
            token,
          },
        });
      }
    }

    // If we reach here, credentials are invalid
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    console.error('Unified login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};
