const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all published tips (public endpoint)
exports.getAllPublishedTips = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = { published: true };

    // Filter by category
    if (category) {
      where.category = category;
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
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          excerpt: true,
          readTime: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        }
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
    console.error('Get published tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tips'
    });
  }
};

// Get single published tip by slug (public endpoint)
exports.getTipBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const tip = await prisma.tip.findFirst({
      where: {
        slug,
        published: true
      }
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
    console.error('Get tip by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tip'
    });
  }
};

// Get available categories (public endpoint)
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.tip.groupBy({
      by: ['category'],
      where: { published: true },
      _count: true
    });

    res.status(200).json({
      success: true,
      data: {
        categories: categories.map(cat => ({
          name: cat.category,
          count: cat._count
        }))
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
};
