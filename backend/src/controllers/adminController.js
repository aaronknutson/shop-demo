const { PrismaClient } = require('@prisma/client');
const yup = require('yup');

const prisma = new PrismaClient();

// Validation schemas
const updateQuoteStatusSchema = yup.object({
  status: yup.string().oneOf(['pending', 'contacted', 'completed', 'cancelled']).required()
});

const updateReviewSchema = yup.object({
  approved: yup.boolean().required()
});

const createCouponSchema = yup.object({
  title: yup.string().min(3).max(100).required(),
  description: yup.string().min(10).max(500).required(),
  discount: yup.string().min(2).max(50).required(),
  code: yup.string().min(3).max(20).uppercase().required(),
  expiresAt: yup.date().min(new Date(), 'Expiry date must be in the future').required(),
  active: yup.boolean().default(true)
});

const updateCouponSchema = yup.object({
  title: yup.string().min(3).max(100),
  description: yup.string().min(10).max(500),
  discount: yup.string().min(2).max(50),
  code: yup.string().min(3).max(20).uppercase(),
  expiresAt: yup.date(),
  active: yup.boolean()
});

// ============================================
// DASHBOARD STATS
// ============================================

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalQuotes,
      pendingQuotes,
      totalContacts,
      totalReviews,
      pendingReviews,
      activeCoupons,
      totalAppointments,
      todayAppointments
    ] = await Promise.all([
      prisma.quote.count(),
      prisma.quote.count({ where: { status: 'pending' } }),
      prisma.contact.count(),
      prisma.review.count(),
      prisma.review.count({ where: { approved: false } }),
      prisma.coupon.count({ where: { active: true, expiresAt: { gte: new Date() } } }),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Get recent quotes (last 5)
    const recentQuotes = await prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        serviceType: true,
        status: true,
        createdAt: true
      }
    });

    // Get recent contacts (last 5)
    const recentContacts = await prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalQuotes,
          pendingQuotes,
          totalContacts,
          totalReviews,
          pendingReviews,
          activeCoupons,
          totalAppointments,
          todayAppointments
        },
        recentQuotes,
        recentContacts
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
};

// ============================================
// QUOTES MANAGEMENT
// ============================================

exports.getAllQuotes = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = status ? { status } : {};

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quote.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        quotes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quotes'
    });
  }
};

exports.getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: { id }
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { quote }
    });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quote'
    });
  }
};

exports.updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = await updateQuoteStatusSchema.validate(req.body);

    const quote = await prisma.quote.update({
      where: { id },
      data: { status: validatedData.status }
    });

    res.status(200).json({
      success: true,
      message: 'Quote status updated successfully',
      data: { quote }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Update quote status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quote status'
    });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quote.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete quote'
    });
  }
};

// ============================================
// REVIEWS MANAGEMENT
// ============================================

exports.getAllReviews = async (req, res) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = approved !== undefined ? { approved: approved === 'true' } : {};

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews'
    });
  }
};

exports.updateReviewApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = await updateReviewSchema.validate(req.body);

    const review = await prisma.review.update({
      where: { id },
      data: { approved: validatedData.approved }
    });

    res.status(200).json({
      success: true,
      message: `Review ${validatedData.approved ? 'approved' : 'rejected'} successfully`,
      data: { review }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Update review approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
};

// ============================================
// COUPONS MANAGEMENT
// ============================================

exports.getAllCoupons = async (req, res) => {
  try {
    const { active, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};
    if (active !== undefined) {
      where.active = active === 'true';
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.coupon.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        coupons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get coupons'
    });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const validatedData = await createCouponSchema.validate(req.body);

    // Check if code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: validatedData.code }
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    const coupon = await prisma.coupon.create({
      data: validatedData
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { coupon }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create coupon'
    });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = await updateCouponSchema.validate(req.body);

    // If code is being updated, check for duplicates
    if (validatedData.code) {
      const existingCoupon = await prisma.coupon.findFirst({
        where: {
          code: validatedData.code,
          NOT: { id }
        }
      });

      if (existingCoupon) {
        return res.status(409).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: validatedData
    });

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: { coupon }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coupon'
    });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.coupon.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coupon'
    });
  }
};

// ============================================
// CONTACTS MANAGEMENT
// ============================================

exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.count()
    ]);

    res.status(200).json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contacts'
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};
