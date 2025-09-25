const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: 200
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    region: String,
    climate: {
      type: String,
      enum: ['tropical', 'subtropical', 'temperate', 'continental', 'polar', 'arid', 'semiarid']
    }
  },
  size: {
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square_meters', 'square_feet'],
      default: 'acres'
    }
  },
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loam', 'silt', 'peat', 'chalk'],
    required: true
  },
  soilPH: {
    type: Number,
    min: 0,
    max: 14
  },
  irrigationSystem: {
    type: String,
    enum: ['drip', 'sprinkler', 'surface', 'subsurface', 'manual', 'none'],
    default: 'none'
  },
  waterSource: {
    type: String,
    enum: ['well', 'river', 'lake', 'municipal', 'rainwater', 'mixed']
  },
  organicCertified: {
    type: Boolean,
    default: false
  },
  certificationDetails: {
    certifier: String,
    certificationDate: Date,
    expiryDate: Date,
    certificateNumber: String
  },
  fields: [{
    name: {
      type: String,
      required: true
    },
    size: {
      value: Number,
      unit: String
    },
    currentCrop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    },
    soilCondition: {
      pH: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      organicMatter: Number
    },
    lastSoilTest: Date
  }],
  images: [String],
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
farmSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Farm', farmSchema);