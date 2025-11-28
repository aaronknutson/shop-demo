const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateAdmin } = require('../middleware/auth');
const { optionalCustomerAuth } = require('../middleware/customerAuth');

// Public routes (customer-facing)
router.get('/available-slots', appointmentController.getAvailableSlots);
router.post('/', optionalCustomerAuth, appointmentController.createAppointment);

// Protected admin routes
router.get('/admin/all', authenticateAdmin, appointmentController.getAllAppointments);
router.get('/admin/stats', authenticateAdmin, appointmentController.getAppointmentStats);
router.get('/admin/:id', authenticateAdmin, appointmentController.getAppointmentById);
router.patch('/admin/:id/status', authenticateAdmin, appointmentController.updateAppointmentStatus);
router.patch('/admin/:id', authenticateAdmin, appointmentController.updateAppointment);
router.delete('/admin/:id', authenticateAdmin, appointmentController.deleteAppointment);

module.exports = router;
