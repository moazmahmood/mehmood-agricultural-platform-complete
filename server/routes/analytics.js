const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// @route   GET /api/analytics/crops
// @desc    Get crop analytics
// @access  Private
router.get('/crops', analyticsController.getCropAnalytics);

// @route   GET /api/analytics/financial
// @desc    Get financial analytics
// @access  Private
router.get('/financial', analyticsController.getFinancialAnalytics);

// @route   GET /api/analytics/yield
// @desc    Get yield analytics
// @access  Private
router.get('/yield', analyticsController.getYieldAnalytics);

module.exports = router;