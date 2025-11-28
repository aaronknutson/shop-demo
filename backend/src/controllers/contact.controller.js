const { PrismaClient } = require('@prisma/client');
const yup = require('yup');
const emailService = require('../services/email.service');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// Validation schema
const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters')
});

/**
 * Submit contact form
 */
const submitContactForm = async (req, res) => {
  try {
    // Validate input
    const validatedData = await contactSchema.validate(req.body, { abortEarly: false });

    // Sanitize input
    const sanitizedData = {
      name: validatedData.name.trim(),
      email: validatedData.email.trim().toLowerCase(),
      phone: validatedData.phone.trim(),
      message: validatedData.message.trim()
    };

    // Save to database
    const contact = await prisma.contact.create({
      data: sanitizedData
    });

    // Send email notification
    try {
      await emailService.sendContactNotification(sanitizedData);
    } catch (emailError) {
      logger.error('Failed to send contact email notification:', emailError);
      // Don't fail the request if email fails
    }

    logger.info(`Contact form submitted: ${contact.id}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact.id
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
  submitContactForm
};
