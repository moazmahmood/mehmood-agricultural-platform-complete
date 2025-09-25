const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getCurrentWeather(latitude, longitude) {
    try {
      if (!WEATHER_API_KEY) {
        throw new Error('Weather API key not configured');
      }

      const response = await axios.get(`${WEATHER_API_URL}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      });

      const weather = response.data;

      return {
        location: weather.name,
        coordinates: { latitude, longitude },
        temperature: {
          current: weather.main.temp,
          feelsLike: weather.main.feels_like,
          min: weather.main.temp_min,
          max: weather.main.temp_max
        },
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        windSpeed: weather.wind?.speed || 0,
        windDirection: weather.wind?.deg || 0,
        visibility: weather.visibility / 1000, // Convert to km
        conditions: {
          main: weather.weather[0].main,
          description: weather.weather[0].description,
          icon: weather.weather[0].icon
        },
        cloudiness: weather.clouds.all,
        sunrise: new Date(weather.sys.sunrise * 1000),
        sunset: new Date(weather.sys.sunset * 1000),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherForecast(latitude, longitude, days = 5) {
    try {
      if (!WEATHER_API_KEY) {
        throw new Error('Weather API key not configured');
      }

      const response = await axios.get(`${WEATHER_API_URL}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: WEATHER_API_KEY,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (every 3 hours)
        }
      });

      const forecast = response.data;

      return {
        location: forecast.city.name,
        coordinates: { latitude, longitude },
        forecasts: forecast.list.map(item => ({
          datetime: new Date(item.dt * 1000),
          temperature: {
            current: item.main.temp,
            feelsLike: item.main.feels_like,
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          humidity: item.main.humidity,
          pressure: item.main.pressure,
          windSpeed: item.wind?.speed || 0,
          windDirection: item.wind?.deg || 0,
          conditions: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          },
          cloudiness: item.clouds.all,
          precipitation: {
            rain: item.rain?.['3h'] || 0,
            snow: item.snow?.['3h'] || 0
          },
          visibility: item.visibility / 1000 // Convert to km
        }))
      };
    } catch (error) {
      console.error('Weather forecast API error:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  async getHistoricalWeather(latitude, longitude, startDate, endDate) {
    try {
      // Note: OpenWeatherMap historical data requires a paid subscription
      // This is a placeholder implementation
      return {
        message: 'Historical weather data requires premium subscription',
        suggestion: 'Use current weather and forecast APIs for agricultural planning'
      };
    } catch (error) {
      console.error('Historical weather API error:', error);
      throw new Error('Failed to fetch historical weather data');
    }
  }

  getAgricultureAdvice(weatherData) {
    const advice = [];
    const temp = weatherData.temperature.current;
    const humidity = weatherData.humidity;
    const windSpeed = weatherData.windSpeed;
    const conditions = weatherData.conditions.main.toLowerCase();

    // Temperature-based advice
    if (temp > 35) {
      advice.push({
        type: 'warning',
        category: 'temperature',
        message: 'High temperature alert. Increase irrigation frequency and consider shade protection for sensitive crops.'
      });
    } else if (temp < 5) {
      advice.push({
        type: 'warning',
        category: 'temperature',
        message: 'Low temperature alert. Protect crops from frost damage and consider covering sensitive plants.'
      });
    }

    // Humidity-based advice
    if (humidity > 85) {
      advice.push({
        type: 'caution',
        category: 'humidity',
        message: 'High humidity levels may promote fungal diseases. Monitor crops closely and ensure good ventilation.'
      });
    } else if (humidity < 30) {
      advice.push({
        type: 'info',
        category: 'humidity',
        message: 'Low humidity levels. Consider increasing irrigation and mulching to retain soil moisture.'
      });
    }

    // Wind-based advice
    if (windSpeed > 15) {
      advice.push({
        type: 'warning',
        category: 'wind',
        message: 'Strong winds detected. Secure tall crops and structures, and avoid spraying pesticides.'
      });
    }

    // Condition-based advice
    if (conditions.includes('rain')) {
      advice.push({
        type: 'info',
        category: 'precipitation',
        message: 'Rain expected. Adjust irrigation schedules and avoid field work if soil becomes waterlogged.'
      });
    } else if (conditions.includes('clear') && temp > 25) {
      advice.push({
        type: 'info',
        category: 'general',
        message: 'Good weather for field activities. Ideal time for planting, harvesting, or applying treatments.'
      });
    }

    return advice;
  }
}

module.exports = new WeatherService();