const { PrismaClient } = require('@prisma/client');
const yup = require('yup');

const prisma = new PrismaClient();

// Validation schema
const createTipSchema = yup.object({
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  title: yup.string().min(5).max(200).required('Title is required'),
  category: yup.string().required('Category is required'),
  excerpt: yup.string().min(20).max(500).required('Excerpt is required'),
  content: yup.string().min(50).required('Content is required'),
  readTime: yup.string().required('Read time is required'),
  tags: yup.array().of(yup.string()).default([]),
  published: yup.boolean().default(false)
});

const updateTipSchema = yup.object({
  slug: yup.string().matches(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  title: yup.string().min(5).max(200),
  category: yup.string(),
  excerpt: yup.string().min(20).max(500),
  content: yup.string().min(50),
  readTime: yup.string(),
  tags: yup.array().of(yup.string()),
  published: yup.boolean()
});

// Get all tips with filtering and pagination
exports.getAllTips = async (req, res) => {
  try {
    const {
      category,
      published,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by published status
    if (published !== undefined) {
      where.published = published === 'true';
    }

    // Search in title, excerpt, or content
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [tips, total] = await Promise.all([
      prisma.tip.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tip.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        tips,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tips'
    });
  }
};

// Get single tip by ID
exports.getTipById = async (req, res) => {
  try {
    const { id } = req.params;

    const tip = await prisma.tip.findUnique({
      where: { id }
    });

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { tip }
    });
  } catch (error) {
    console.error('Get tip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tip'
    });
  }
};

// Create new tip
exports.createTip = async (req, res) => {
  try {
    const validatedData = await createTipSchema.validate(req.body, { abortEarly: false });

    // Check if slug already exists
    const existingTip = await prisma.tip.findUnique({
      where: { slug: validatedData.slug }
    });

    if (existingTip) {
      return res.status(409).json({
        success: false,
        message: 'A tip with this slug already exists'
      });
    }

    const tip = await prisma.tip.create({
      data: validatedData
    });

    res.status(201).json({
      success: true,
      message: 'Tip created successfully',
      data: { tip }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Create tip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tip'
    });
  }
};

// Update tip
exports.updateTip = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = await updateTipSchema.validate(req.body, { abortEarly: false });

    // Check if tip exists
    const existingTip = await prisma.tip.findUnique({
      where: { id }
    });

    if (!existingTip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    // If slug is being updated, check if new slug already exists
    if (validatedData.slug && validatedData.slug !== existingTip.slug) {
      const slugExists = await prisma.tip.findUnique({
        where: { slug: validatedData.slug }
      });

      if (slugExists) {
        return res.status(409).json({
          success: false,
          message: 'A tip with this slug already exists'
        });
      }
    }

    const tip = await prisma.tip.update({
      where: { id },
      data: validatedData
    });

    res.status(200).json({
      success: true,
      message: 'Tip updated successfully',
      data: { tip }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Update tip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tip'
    });
  }
};

// Delete tip
exports.deleteTip = async (req, res) => {
  try {
    const { id } = req.params;

    const tip = await prisma.tip.findUnique({
      where: { id }
    });

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    await prisma.tip.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Tip deleted successfully'
    });
  } catch (error) {
    console.error('Delete tip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tip'
    });
  }
};

// Toggle published status
exports.togglePublished = async (req, res) => {
  try {
    const { id } = req.params;

    const tip = await prisma.tip.findUnique({
      where: { id }
    });

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    const updatedTip = await prisma.tip.update({
      where: { id },
      data: { published: !tip.published }
    });

    res.status(200).json({
      success: true,
      message: `Tip ${updatedTip.published ? 'published' : 'unpublished'} successfully`,
      data: { tip: updatedTip }
    });
  } catch (error) {
    console.error('Toggle published error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle published status'
    });
  }
};

// Get tip statistics
exports.getTipStats = async (req, res) => {
  try {
    const [totalTips, publishedTips, draftTips, categories] = await Promise.all([
      prisma.tip.count(),
      prisma.tip.count({ where: { published: true } }),
      prisma.tip.count({ where: { published: false } }),
      prisma.tip.groupBy({
        by: ['category'],
        _count: true
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTips,
        publishedTips,
        draftTips,
        categoryCounts: categories.reduce((acc, cat) => {
          acc[cat.category] = cat._count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get tip stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tip statistics'
    });
  }
};
