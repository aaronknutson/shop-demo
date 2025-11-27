const express = require('express');
const router = express.Router();
const customerAuthController = require('../controllers/customerAuthController');
const customerPortalController = require('../controllers/customerPortalController');
const { verifyCustomerToken } = require('../middleware/customerAuth');

// Authentication routes (public)
router.post('/auth/register', customerAuthController.register);
router.post('/auth/login', customerAuthController.login);

// Protected routes (require authentication)
router.use(verifyCustomerToken);

// Profile routes
router.get('/auth/profile', customerAuthController.getProfile);
router.patch('/auth/profile', customerAuthController.updateProfile);
router.post('/auth/change-password', customerAuthController.changePassword);

// Dashboard
router.get('/dashboard', customerPortalController.getDashboard);

// Vehicles
router.get('/vehicles', customerPortalController.getVehicles);
router.post('/vehicles', customerPortalController.createVehicle);
router.get('/vehicles/:id', customerPortalController.getVehicle);
router.patch('/vehicles/:id', customerPortalController.updateVehicle);
router.delete('/vehicles/:id', customerPortalController.deleteVehicle);

// Appointments
router.get('/appointments', customerPortalController.getAppointments);
router.get('/appointments/:id', customerPortalController.getAppointment);
router.patch('/appointments/:id/cancel', customerPortalController.cancelAppointment);

// Service history
router.get('/service-history', customerPortalController.getServiceHistory);
router.get('/service-history/:id', customerPortalController.getServiceRecord);

module.exports = router;
