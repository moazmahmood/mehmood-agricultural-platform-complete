const weatherService = require('../services/weatherService');
const Farm = require('../models/Farm');

const getCurrentWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const weather = await weatherService.getCurrentWeather(lat, lon);
    const advice = weatherService.getAgricultureAdvice(weather);

    res.json({
      weather,
      agriculturalAdvice: advice
    });
  } catch (error) {
    console.error('Get current weather error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getWeatherForecast = async (req, res) => {
  try {
    const { latitude, longitude, days = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const forecastDays = parseInt(days);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    if (isNaN(forecastDays) || forecastDays < 1 || forecastDays > 5) {
      return res.status(400).json({ error: 'Days must be between 1 and 5' });
    }

    const forecast = await weatherService.getWeatherForecast(lat, lon, forecastDays);

    res.json({ forecast });
  } catch (error) {
    console.error('Get weather forecast error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getFarmWeather = async (req, res) => {
  try {
    const { farmId } = req.params;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Check if user has access to this farm
    if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { latitude, longitude } = farm.location.coordinates;
    
    const [weather, forecast] = await Promise.all([
      weatherService.getCurrentWeather(latitude, longitude),
      weatherService.getWeatherForecast(latitude, longitude, 3)
    ]);

    const advice = weatherService.getAgricultureAdvice(weather);

    res.json({
      farm: {
        id: farm._id,
        name: farm.name,
        location: farm.location
      },
      currentWeather: weather,
      forecast: forecast.forecasts,
      agriculturalAdvice: advice
    });
  } catch (error) {
    console.error('Get farm weather error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getWeatherAlerts = async (req, res) => {
  try {
    let query = {};
    
    // Filter by user's farms if not admin
    if (req.user.role !== 'admin') {
      query.owner = req.user._id;
    }

    const farms = await Farm.find(query).select('name location.coordinates');
    
    const alerts = [];
    
    for (const farm of farms) {
      try {
        const { latitude, longitude } = farm.location.coordinates;
        const weather = await weatherService.getCurrentWeather(latitude, longitude);
        const advice = weatherService.getAgricultureAdvice(weather);
        
        // Filter for warnings and cautions only
        const criticalAdvice = advice.filter(item => 
          item.type === 'warning' || item.type === 'caution'
        );
        
        if (criticalAdvice.length > 0) {
          alerts.push({
            farmId: farm._id,
            farmName: farm.name,
            location: farm.location,
            weather: {
              temperature: weather.temperature.current,
              conditions: weather.conditions.description,
              humidity: weather.humidity,
              windSpeed: weather.windSpeed
            },
            alerts: criticalAdvice
          });
        }
      } catch (error) {
        console.error(`Weather alert error for farm ${farm._id}:`, error);
        // Continue with other farms
      }
    }

    res.json({ alerts });
  } catch (error) {
    console.error('Get weather alerts error:', error);
    res.status(500).json({ error: 'Server error while fetching weather alerts' });
  }
};

const getHistoricalWeather = async (req, res) => {
  try {
    const { latitude, longitude, startDate, endDate } = req.query;

    if (!latitude || !longitude || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Latitude, longitude, startDate, and endDate are required' 
      });
    }

    const result = await weatherService.getHistoricalWeather(
      parseFloat(latitude),
      parseFloat(longitude),
      new Date(startDate),
      new Date(endDate)
    );

    res.json(result);
  } catch (error) {
    console.error('Get historical weather error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast,
  getFarmWeather,
  getWeatherAlerts,
  getHistoricalWeather
};