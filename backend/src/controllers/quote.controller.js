const { PrismaClient } = require('@prisma/client');
const yup = require('yup');
const emailService = require('../services/email.service');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Validation schema
const quoteSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  vehicleMake: yup.string(),
  vehicleModel: yup.string(),
  vehicleYear: yup.number().integer().min(1900).max(new Date().getFullYear() + 1),
  serviceType: yup.string().required('Service type is required'),
  preferredDate: yup.date(),
  message: yup.string()
});

/**
 * Submit quote request
 */
const submitQuoteRequest = async (req, res) => {
  try {
    // Validate input
    const validatedData = await quoteSchema.validate(req.body, { abortEarly: false });

    // Sanitize input
    const sanitizedData = {
      name: validatedData.name.trim(),
      email: validatedData.email.trim().toLowerCase(),
      phone: validatedData.phone.trim(),
      vehicleMake: validatedData.vehicleMake?.trim(),
      vehicleModel: validatedData.vehicleModel?.trim(),
      vehicleYear: validatedData.vehicleYear,
      serviceType: validatedData.serviceType.trim(),
      preferredDate: validatedData.preferredDate,
      message: validatedData.message?.trim()
    };

    // Save to database
    const quote = await prisma.quote.create({
      data: sanitizedData
    });

    // Send email notification
    try {
      await emailService.sendQuoteNotification(sanitizedData);
    } catch (emailError) {
      logger.error('Failed to send quote email notification:', emailError);
      // Don't fail the request if email fails
    }

    logger.info(`Quote request submitted: ${quote.id}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for your quote request! We will contact you shortly.',
      data: {
        id: quote.id
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new AppError(error.errors.join(', '), 400);
    }
    throw error;
  }
};

module.exports = {
  submitQuoteRequest
};
