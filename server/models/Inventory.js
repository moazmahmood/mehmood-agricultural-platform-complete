const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['seeds', 'fertilizers', 'pesticides', 'equipment', 'tools', 'other']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  quantity: {
    current: {
      type: Number,
      required: [true, 'Current quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    initial: {
      type: Number,
      required: [true, 'Initial quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    minimum: {
      type: Number,
      default: 0,
      min: [0, 'Minimum quantity cannot be negative']
    }
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  cost: {
    unitPrice: {
      type: Number,
      min: [0, 'Unit price cannot be negative']
    },
    totalCost: {
      type: Number,
      min: [0, 'Total cost cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  supplier: {
    name: String,
    contact: String,
    address: String
  },
  location: {
    storage: String,
    section: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  batchNumber: {
    type: String,
    trim: true
  },
  usage: [{
    date: {
      type: Date,
      default: Date.now
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Usage quantity cannot be negative']
    },
    purpose: {
      type: String,
      required: true,
      trim: true
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    },
    notes: String,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'expired'],
    default: 'in-stock'
  },
  alerts: {
    lowStock: {
      type: Boolean,
      default: false
    },
    expiringSoon: {
      type: Boolean,
      default: false
    },
    expired: {
      type: Boolean,
      default: false
    }
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
  }
}, {
  timestamps: true
});

// Virtual for calculating used quantity
inventorySchema.virtual('usedQuantity').get(function() {
  return this.usage.reduce((total, use) => total + use.quantity, 0);
});

// Virtual for calculating remaining percentage
inventorySchema.virtual('remainingPercentage').get(function() {
  if (this.quantity.initial === 0) return 0;
  return (this.quantity.current / this.quantity.initial) * 100;
});

// Pre-save middleware to update status and alerts
inventorySchema.pre('save', function(next) {
  // Update status based on quantity
  if (this.quantity.current === 0) {
    this.status = 'out-of-stock';
  } else if (this.quantity.current <= this.quantity.minimum) {
    this.status = 'low-stock';
  } else if (this.expiryDate && this.expiryDate <= new Date()) {
    this.status = 'expired';
  } else {
    this.status = 'in-stock';
  }

  // Update alerts
  this.alerts.lowStock = this.quantity.current <= this.quantity.minimum;
  this.alerts.outOfStock = this.quantity.current === 0;
  
  if (this.expiryDate) {
    const daysUntilExpiry = (this.expiryDate - new Date()) / (24 * 60 * 60 * 1000);
    this.alerts.expiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    this.alerts.expired = daysUntilExpiry <= 0;
  }

  next();
});

// Index for text search
inventorySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Inventory', inventorySchema);