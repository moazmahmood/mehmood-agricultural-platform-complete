const express = require('express');
const weatherController = require('../controllers/weatherController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/weather/current
// @desc    Get current weather for location
// @access  Private
router.get('/current', weatherController.getCurrentWeather);

// @route   GET /api/weather/forecast
// @desc    Get weather forecast for location
// @access  Private
router.get('/forecast', weatherController.getWeatherForecast);

// @route   GET /api/weather/alerts
// @desc    Get weather alerts for location
// @access  Private
router.get('/alerts', weatherController.getWeatherAlerts);

// @route   GET /api/weather/historical
// @desc    Get historical weather data
// @access  Private
router.get('/historical', weatherController.getHistoricalWeather);

module.exports = router;