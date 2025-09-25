import api from './api';

class WeatherService {
  async getCurrentWeather(latitude, longitude) {
    const response = await api.get('/weather/current', {
      params: { latitude, longitude },
    });
    return response.data;
  }

  async getWeatherForecast(latitude, longitude, days = 5) {
    const response = await api.get('/weather/forecast', {
      params: { latitude, longitude, days },
    });
    return response.data;
  }

  async getFarmWeather(farmId) {
    const response = await api.get(`/weather/farm/${farmId}`);
    return response.data;
  }

  async getWeatherAlerts() {
    const response = await api.get('/weather/alerts');
    return response.data;
  }

  async getHistoricalWeather(latitude, longitude, startDate, endDate) {
    const response = await api.get('/weather/historical', {
      params: { latitude, longitude, startDate, endDate },
    });
    return response.data;
  }
}

export const weatherService = new WeatherService();