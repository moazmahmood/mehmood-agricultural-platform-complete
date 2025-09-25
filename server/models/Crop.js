const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  variety: {
    type: String,
    trim: true
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plantingDate: {
    type: Date,
    required: [true, 'Planting date is required']
  },
  expectedHarvestDate: {
    type: Date,
    required: [true, 'Expected harvest date is required']
  },
  actualHarvestDate: {
    type: Date
  },
  area: {
    value: {
      type: Number,
      required: [true, 'Crop area is required'],
      min: [0, 'Area cannot be negative']
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square_meters'],
      default: 'acres'
    }
  },
  growthStage: {
    type: String,
    enum: ['planted', 'germination', 'vegetative', 'flowering', 'fruiting', 'mature', 'harvested'],
    default: 'planted'
  },
  healthStatus: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'critical'],
    default: 'good'
  },
  irrigationType: {
    type: String,
    enum: ['drip', 'sprinkler', 'flood', 'furrow', 'none']
  },
  fertilizers: [{
    name: String,
    type: {
      type: String,
      enum: ['organic', 'inorganic', 'bio-fertilizer']
    },
    applicationDate: Date,
    quantity: {
      value: Number,
      unit: String
    },
    notes: String
  }],
  pesticides: [{
    name: String,
    type: {
      type: String,
      enum: ['insecticide', 'herbicide', 'fungicide', 'organic']
    },
    applicationDate: Date,
    quantity: {
      value: Number,
      unit: String
    },
    targetPest: String,
    notes: String
  }],
  monitoring: [{
    date: {
      type: Date,
      default: Date.now
    },
    height: Number, // in cm
    healthScore: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String,
    images: [String],
    weather: {
      temperature: Number,
      humidity: Number,
      rainfall: Number
    }
  }],
  yield: {
    expected: {
      value: Number,
      unit: String
    },
    actual: {
      value: Number,
      unit: String
    }
  },
  expenses: [{
    category: {
      type: String,
      enum: ['seeds', 'fertilizers', 'pesticides', 'labor', 'equipment', 'irrigation', 'other']
    },
    description: String,
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  revenue: {
    totalSold: {
      value: Number,
      unit: String
    },
    pricePerUnit: Number,
    totalRevenue: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Virtual for profit calculation
cropSchema.virtual('profit').get(function() {
  const totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRevenue = this.revenue.totalRevenue || 0;
  return totalRevenue - totalExpenses;
});

module.exports = mongoose.model('Crop', cropSchema);