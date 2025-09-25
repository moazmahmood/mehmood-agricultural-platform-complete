const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: [100, 'Farm name cannot exceed 100 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Farm address is required']
    },
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    }
  },
  area: {
    value: {
      type: Number,
      required: [true, 'Farm area is required'],
      min: [0, 'Area cannot be negative']
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square_meters'],
      default: 'acres'
    }
  },
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loamy', 'silt', 'peaty', 'chalky'],
    required: [true, 'Soil type is required']
  },
  climateZone: {
    type: String,
    enum: ['tropical', 'temperate', 'arid', 'continental', 'polar']
  },
  images: [{
    url: String,
    caption: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  establishedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
farmSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Farm', farmSchema);