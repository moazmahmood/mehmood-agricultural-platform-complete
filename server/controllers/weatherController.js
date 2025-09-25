const axios = require('axios');
const Weather = require('../models/Weather');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';

// @desc    Get current weather for location
// @route   GET /api/weather/current
// @access  Private
exports.getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Check if we have recent weather data in database
    const recentWeather = await Weather.findOne({
      'location.coordinates.latitude': lat,
      'location.coordinates.longitude': lon,
      lastUpdated: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // 30 minutes
    });

    if (recentWeather) {
      return res.json({
        success: true,
        weather: recentWeather.current,
        source: 'cache'
      });
    }

    // Fetch from external API if no API key provided (demo mode)
    if (!WEATHER_API_KEY) {
      const mockWeather = {
        temperature: { celsius: 25, fahrenheit: 77 },
        humidity: 65,
        pressure: 1013,
        windSpeed: 15,
        windDirection: 180,
        visibility: 10,
        cloudCover: 40,
        uvIndex: 6,
        condition: 'partly-cloudy',
        description: 'Partly cloudy with scattered clouds'
      };

      return res.json({
        success: true,
        weather: mockWeather,
        source: 'demo'
      });
    }

    // Fetch from OpenWeatherMap API
    const response = await axios.get(`${WEATHER_API_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const weatherData = response.data;
    const current = {
      temperature: {
        celsius: weatherData.main.temp,
        fahrenheit: (weatherData.main.temp * 9/5) + 32
      },
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      windSpeed: weatherData.wind.speed * 3.6, // Convert m/s to km/h
      windDirection: weatherData.wind.deg,
      visibility: weatherData.visibility / 1000, // Convert m to km
      cloudCover: weatherData.clouds.all,
      uvIndex: 0, // Not available in current weather API
      condition: weatherData.weather[0].main.toLowerCase(),
      description: weatherData.weather[0].description
    };

    // Save to database
    const weather = new Weather({
      location: {
        city: city || weatherData.name,
        country: weatherData.sys.country,
        coordinates: {
          latitude: lat,
          longitude: lon
        }
      },
      current,
      lastUpdated: new Date()
    });

    await weather.save();

    res.json({
      success: true,
      weather: current,
      source: 'api'
    });
  } catch (error) {
    console.error('Get current weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weather data'
    });
  }
};

// @desc    Get weather forecast for location
// @route   GET /api/weather/forecast
// @access  Private
exports.getWeatherForecast = async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Demo mode if no API key
    if (!WEATHER_API_KEY) {
      const mockForecast = Array.from({ length: parseInt(days) }, (_, i) => ({
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        temperature: {
          min: 18 + Math.random() * 5,
          max: 28 + Math.random() * 5,
          celsius: 23 + Math.random() * 5,
          fahrenheit: 73 + Math.random() * 9
        },
        humidity: 60 + Math.random() * 20,
        precipitation: {
          probability: Math.random() * 100,
          amount: Math.random() * 10
        },
        windSpeed: 10 + Math.random() * 10,
        condition: ['sunny', 'cloudy', 'rainy', 'partly-cloudy'][Math.floor(Math.random() * 4)],
        description: 'Mock weather forecast'
      }));

      return res.json({
        success: true,
        forecast: mockForecast,
        source: 'demo'
      });
    }

    // Fetch from OpenWeatherMap API
    const response = await axios.get(`${WEATHER_API_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const forecastData = response.data.list.slice(0, parseInt(days));
    const forecast = forecastData.map(item => ({
      date: new Date(item.dt * 1000),
      temperature: {
        min: item.main.temp_min,
        max: item.main.temp_max,
        celsius: item.main.temp,
        fahrenheit: (item.main.temp * 9/5) + 32
      },
      humidity: item.main.humidity,
      precipitation: {
        probability: (item.pop || 0) * 100,
        amount: item.rain ? item.rain['3h'] || 0 : 0
      },
      windSpeed: item.wind.speed * 3.6,
      condition: item.weather[0].main.toLowerCase(),
      description: item.weather[0].description
    }));

    res.json({
      success: true,
      forecast,
      source: 'api'
    });
  } catch (error) {
    console.error('Get weather forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weather forecast'
    });
  }
};

// @desc    Get weather alerts for location
// @route   GET /api/weather/alerts
// @access  Private
exports.getWeatherAlerts = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Get alerts from database
    const weather = await Weather.findOne({
      'location.coordinates.latitude': lat,
      'location.coordinates.longitude': lon,
      'alerts.isActive': true
    });

    const alerts = weather ? weather.alerts.filter(alert => alert.isActive) : [];

    res.json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error('Get weather alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weather alerts'
    });
  }
};

// @desc    Get historical weather data
// @route   GET /api/weather/historical
// @access  Private
exports.getHistoricalWeather = async (req, res) => {
  try {
    const { lat, lon, startDate, endDate } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const query = {
      'location.coordinates.latitude': lat,
      'location.coordinates.longitude': lon
    };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const historicalData = await Weather.find(query)
      .select('historical createdAt')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({
      success: true,
      historical: historicalData
    });
  } catch (error) {
    console.error('Get historical weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching historical weather data'
    });
  }
};