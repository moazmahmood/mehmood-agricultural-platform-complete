const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: {
    city: String,
    country: String,
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  current: {
    temperature: {
      celsius: Number,
      fahrenheit: Number
    },
    humidity: Number, // percentage
    pressure: Number, // hPa
    windSpeed: Number, // km/h
    windDirection: Number, // degrees
    visibility: Number, // km
    cloudCover: Number, // percentage
    uvIndex: Number,
    condition: String, // sunny, cloudy, rainy, etc.
    description: String
  },
  forecast: [{
    date: Date,
    temperature: {
      min: Number,
      max: Number,
      celsius: Number,
      fahrenheit: Number
    },
    humidity: Number,
    precipitation: {
      probability: Number, // percentage
      amount: Number // mm
    },
    windSpeed: Number,
    condition: String,
    description: String
  }],
  historical: [{
    date: Date,
    temperature: {
      min: Number,
      max: Number,
      average: Number
    },
    humidity: Number,
    precipitation: Number,
    windSpeed: Number
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['frost', 'heatwave', 'storm', 'drought', 'flood', 'high_wind']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    title: String,
    description: String,
    startTime: Date,
    endTime: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'OpenWeatherMap'
  }
}, {
  timestamps: true
});

// Index for geospatial queries
weatherSchema.index({ 'location.coordinates': '2dsphere' });

// TTL index to automatically delete old weather data after 30 days
weatherSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('Weather', weatherSchema);