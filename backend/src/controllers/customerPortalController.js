const { PrismaClient } = require('@prisma/client');
const yup = require('yup');

const prisma = new PrismaClient();

// Validation schemas
const vehicleSchema = yup.object({
  year: yup.number().min(1900).max(new Date().getFullYear() + 1).required(),
  make: yup.string().required(),
  model: yup.string().required(),
  vin: yup.string().optional(),
  licensePlate: yup.string().optional(),
  mileage: yup.number().min(0).optional(),
  notes: yup.string().optional(),
  isPrimary: yup.boolean().optional(),
});

/**
 * Get customer dashboard data
 */
exports.getDashboard = async (req, res) => {
  try {
    const customerId = req.customer.id;

    // Get counts and recent data
    const [vehicleCount, upcomingAppointments, recentServiceHistory] = await Promise.all([
      prisma.vehicle.count({ where: { customerId } }),
      prisma.appointment.findMany({
        where: {
          customerId,
          appointmentDate: { gte: new Date() },
        },
        orderBy: { appointmentDate: 'asc' },
        take: 5,
      }),
      prisma.serviceRecord.findMany({
        where: { customerId },
        orderBy: { serviceDate: 'desc' },
        take: 5,
      }),
    ]);

    const stats = {
      vehicleCount,
      upcomingAppointmentsCount: upcomingAppointments.length,
      serviceHistoryCount: await prisma.serviceRecord.count({ where: { customerId } }),
    };

    res.json({
      success: true,
      data: {
        stats,
        upcomingAppointments,
        recentServiceHistory,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
    });
  }
};

/**
 * Get all customer vehicles
 */
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { customerId: req.customer.id },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vehicles',
    });
  }
};

/**
 * Get single vehicle
 */
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: req.params.id,
        customerId: req.customer.id,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vehicle',
    });
  }
};

/**
 * Create new vehicle
 */
exports.createVehicle = async (req, res) => {
  try {
    const validatedData = await vehicleSchema.validate(req.body);

    // If this is set as primary, unset other primary vehicles
    if (validatedData.isPrimary) {
      await prisma.vehicle.updateMany({
        where: { customerId: req.customer.id, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ...validatedData,
        customerId: req.customer.id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    console.error('Create vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create vehicle',
    });
  }
};

/**
 * Update vehicle
 */
exports.updateVehicle = async (req, res) => {
  try {
    const validatedData = await vehicleSchema.validate(req.body);

    // Check if vehicle belongs to customer
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id: req.params.id,
        customerId: req.customer.id,
      },
    });

    if (!existingVehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // If this is set as primary, unset other primary vehicles
    if (validatedData.isPrimary) {
      await prisma.vehicle.updateMany({
        where: {
          customerId: req.customer.id,
          isPrimary: true,
          id: { not: req.params.id },
        },
        data: { isPrimary: false },
      });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: validatedData,
    });

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle',
    });
  }
};

/**
 * Delete vehicle
 */
exports.deleteVehicle = async (req, res) => {
  try {
    // Check if vehicle belongs to customer
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: req.params.id,
        customerId: req.customer.id,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    await prisma.vehicle.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle',
    });
  }
};

/**
 * Get customer appointments
 */
exports.getAppointments = async (req, res) => {
  try {
    const { status, upcoming } = req.query;

    const where = { customerId: req.customer.id };

    if (status) {
      where.status = status;
    }

    if (upcoming === 'true') {
      where.appointmentDate = { gte: new Date() };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { appointmentDate: 'desc' },
    });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
    });
  }
};

/**
 * Get single appointment
 */
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: req.params.id,
        customerId: req.customer.id,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment',
    });
  }
};

/**
 * Cancel appointment
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: req.params.id,
        customerId: req.customer.id,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Only allow canceling pending or confirmed appointments
    if (!['pending', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this appointment',
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' },
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: updatedAppointment,
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
    });
  }
};

/**
 * Get service history
 */
exports.getServiceHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.serviceRecord.findMany({
        where: { customerId: req.customer.id },
        orderBy: { serviceDate: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.serviceRecord.count({
        where: { customerId: req.customer.id },
      }),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get service history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service history',
    });
  }
};

/**
 * Get single service record
 */
exports.getServiceRecord = async (req, res) => {
  try {
    const record = await prisma.serviceRecord.findFirst({
      where: {
        id: req.params.id,
        customerId: req.customer.id,
      },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found',
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Get service record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service record',
    });
  }
};
