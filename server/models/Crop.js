const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  variety: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['cereals', 'vegetables', 'fruits', 'legumes', 'oilseeds', 'spices', 'fiber', 'fodder'],
    required: true
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  field: {
    type: String,
    required: true
  },
  plantingDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: {
    type: Date,
    required: true
  },
  actualHarvestDate: {
    type: Date
  },
  growthStage: {
    type: String,
    enum: ['seeding', 'germination', 'vegetative', 'flowering', 'fruiting', 'maturity', 'harvested'],
    default: 'seeding'
  },
  area: {
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square_meters'],
      default: 'acres'
    }
  },
  seedSource: {
    supplier: String,
    variety: String,
    treatmentApplied: Boolean,
    seedRate: {
      value: Number,
      unit: String
    }
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
    method: {
      type: String,
      enum: ['broadcast', 'banding', 'foliar', 'fertigation']
    },
    cost: Number
  }],
  pesticides: [{
    name: String,
    type: {
      type: String,
      enum: ['insecticide', 'herbicide', 'fungicide', 'nematicide']
    },
    targetPest: String,
    applicationDate: Date,
    quantity: {
      value: Number,
      unit: String
    },
    method: {
      type: String,
      enum: ['spray', 'dust', 'granular', 'seed_treatment']
    },
    cost: Number,
    preharvest_interval: Number // days
  }],
  irrigation: [{
    date: Date,
    duration: Number, // minutes
    method: String,
    waterAmount: {
      value: Number,
      unit: String
    }
  }],
  monitoring: [{
    date: {
      type: Date,
      default: Date.now
    },
    height: Number, // cm
    healthStatus: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'diseased']
    },
    diseases: [String],
    pests: [String],
    weatherConditions: {
      temperature: Number,
      humidity: Number,
      rainfall: Number
    },
    notes: String,
    images: [String]
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
  financials: {
    seedCost: Number,
    fertilizerCost: Number,
    pesticideCost: Number,
    laborCost: Number,
    irrigationCost: Number,
    harvestingCost: Number,
    totalInvestment: Number,
    revenue: Number,
    profit: Number
  },
  certifications: [{
    type: String,
    certifier: String,
    validUntil: Date
  }],
  status: {
    type: String,
    enum: ['active', 'harvested', 'failed', 'experimental'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Calculate total investment
cropSchema.methods.calculateTotalInvestment = function() {
  const costs = this.financials;
  this.financials.totalInvestment = 
    (costs.seedCost || 0) + 
    (costs.fertilizerCost || 0) + 
    (costs.pesticideCost || 0) + 
    (costs.laborCost || 0) + 
    (costs.irrigationCost || 0) + 
    (costs.harvestingCost || 0);
  return this.financials.totalInvestment;
};

// Calculate profit
cropSchema.methods.calculateProfit = function() {
  this.financials.profit = (this.financials.revenue || 0) - (this.financials.totalInvestment || 0);
  return this.financials.profit;
};

module.exports = mongoose.model('Crop', cropSchema);