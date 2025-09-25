const express = require('express');
const {
  getCurrentWeather,
  getWeatherForecast,
  getFarmWeather,
  getWeatherAlerts,
  getHistoricalWeather
} = require('../controllers/weatherController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All weather routes require authentication
router.use(auth);

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);
router.get('/farm/:farmId', getFarmWeather);
router.get('/alerts', getWeatherAlerts);
router.get('/historical', getHistoricalWeather);

module.exports = router;