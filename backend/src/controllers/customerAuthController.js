const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const yup = require('yup');

const prisma = new PrismaClient();

// Validation schemas
const registerSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  phone: yup.string().required(),
});

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const updateProfileSchema = yup.object({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  phone: yup.string().optional(),
});

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup.string().min(8).required(),
});

/**
 * Register a new customer
 */
exports.register = async (req, res) => {
  try {
    const validatedData = await registerSchema.validate(req.body);

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { id: customer.id, email: customer.email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        customer,
        token,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

/**
 * Customer login
 */
exports.login = async (req, res) => {
  try {
    const validatedData = await loginSchema.validate(req.body);

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if active
    if (!customer.active) {
      return res.status(403).json({
        success: false,
        message: 'Account is disabled',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      customer.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: customer.id, email: customer.email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
        },
        token,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

/**
 * Get customer profile
 */
exports.getProfile = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.customer.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
    });
  }
};

/**
 * Update customer profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const validatedData = await updateProfileSchema.validate(req.body);

    const customer = await prisma.customer.update({
      where: { id: req.customer.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: customer,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const validatedData = await changePasswordSchema.validate(req.body);

    // Get customer with password
    const customer = await prisma.customer.findUnique({
      where: { id: req.customer.id },
    });

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      validatedData.currentPassword,
      customer.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Update password
    await prisma.customer.update({
      where: { id: req.customer.id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};
