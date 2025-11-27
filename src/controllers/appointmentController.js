const { PrismaClient } = require('@prisma/client');
const yup = require('yup');

const prisma = new PrismaClient();

// Validation schema
const createAppointmentSchema = yup.object({
  customerName: yup.string().min(2).max(100).required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().min(10).max(20).required('Phone number is required'),
  vehicleMake: yup.string().max(50),
  vehicleModel: yup.string().max(50),
  vehicleYear: yup.number().min(1900).max(new Date().getFullYear() + 1),
  serviceType: yup.string().required('Service type is required'),
  appointmentDate: yup.date().min(new Date(), 'Date must be in the future').required('Date is required'),
  appointmentTime: yup.string().required('Time is required'),
  duration: yup.number().min(30).max(240).default(60),
  notes: yup.string().max(1000)
});

// Business hours configuration
const BUSINESS_HOURS = {
  monday: { open: '08:00', close: '18:00' },
  tuesday: { open: '08:00', close: '18:00' },
  wednesday: { open: '08:00', close: '18:00' },
  thursday: { open: '08:00', close: '18:00' },
  friday: { open: '08:00', close: '18:00' },
  saturday: { open: '09:00', close: '16:00' },
  sunday: null // Closed
};

// Generate time slots in 1-hour increments (12-hour format with AM/PM)
const generateTimeSlots = (openTime, closeTime) => {
  const slots = [];
  const [openHour] = openTime.split(':').map(Number);
  const [closeHour] = closeTime.split(':').map(Number);

  // Generate slots from opening until one hour before closing
  // (last appointment slot is one hour before close)
  for (let hour = openHour; hour < closeHour; hour++) {
    // Convert to 12-hour format with AM/PM
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    slots.push(`${displayHour}:00 ${period}`);
  }

  return slots;
};

// ============================================
// PUBLIC ENDPOINTS (Customer-facing)
// ============================================

// Get available time slots for a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    // Parse the date and get day of week
    const appointmentDate = new Date(date + 'T00:00:00');

    // Check if date is valid
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Get day of week in lowercase (monday, tuesday, etc.)
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Check if shop is open
    if (!BUSINESS_HOURS[dayOfWeek]) {
      return res.status(200).json({
        success: true,
        data: {
          availableSlots: [],
          message: 'Shop is closed on this day'
        }
      });
    }

    // Generate time slots for this day based on business hours
    const hours = BUSINESS_HOURS[dayOfWeek];
    const allTimeSlots = generateTimeSlots(hours.open, hours.close);

    // Create date range for the selected day
    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');

    // Get all appointments for this date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startOfDay,
          lt: endOfDay
        },
        status: {
          in: ['pending', 'confirmed']
        }
      },
      select: {
        appointmentTime: true
      }
    });

    const bookedSlots = existingAppointments.map(apt => apt.appointmentTime);
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      data: {
        availableSlots,
        businessHours: BUSINESS_HOURS[dayOfWeek]
      }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available slots'
    });
  }
};

// Create new appointment (customer booking)
exports.createAppointment = async (req, res) => {
  try {
    const validatedData = await createAppointmentSchema.validate(req.body, { abortEarly: false });

    // Check if time slot is still available
    const appointmentDate = new Date(validatedData.appointmentDate);
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        appointmentDate: {
          gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        },
        appointmentTime: validatedData.appointmentTime,
        status: {
          in: ['pending', 'confirmed']
        }
      }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is no longer available'
      });
    }

    // Check if customer is authenticated (optional - link appointment to customer account)
    let customerId = null;
    if (req.customer && req.customer.id) {
      customerId = req.customer.id;
    }

    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        customerId
      }
    });

    // TODO: Send confirmation email to customer
    // TODO: Send notification to shop

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! We will contact you shortly to confirm.',
      data: { appointment }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }

    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment'
    });
  }
};

// ============================================
// ADMIN ENDPOINTS (Protected)
// ============================================

// Get all appointments with filtering
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    if (status) {
      where.status = status;
    }

    if (date) {
      const selectedDate = new Date(date);
      where.appointmentDate = {
        gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [
          { appointmentDate: 'asc' },
          { appointmentTime: 'asc' }
        ]
      }),
      prisma.appointment.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments'
    });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment'
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status }
    });

    // TODO: Send email notification to customer about status change

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status'
    });
  }
};

// Update appointment details
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.createdAt;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment'
    });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment'
    });
  }
};

// Get appointment statistics
exports.getAppointmentStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      todayAppointments,
      upcomingAppointments
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'pending' } }),
      prisma.appointment.count({ where: { status: 'confirmed' } }),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: today },
          status: { in: ['pending', 'confirmed'] }
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        todayAppointments,
        upcomingAppointments
      }
    });
  } catch (error) {
    console.error('Get appointment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment statistics'
    });
  }
};
