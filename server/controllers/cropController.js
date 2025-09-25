const { validationResult } = require('express-validator');
const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// @desc    Get all crops for current user
// @route   GET /api/crops
// @access  Private
exports.getCrops = async (req, res) => {
  try {
    const { status, farm } = req.query;
    const filter = { farmer: req.user.userId };

    if (status) filter.status = status;
    if (farm) filter.farm = farm;

    const crops = await Crop.find(filter)
      .populate('farm', 'name location')
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: crops.length,
      crops
    });
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Private
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.userId
    })
      .populate('farm', 'name location')
      .populate('farmer', 'name email');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      crop
    });
  } catch (error) {
    console.error('Get crop by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create a new crop
// @route   POST /api/crops
// @access  Private
exports.createCrop = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify farm ownership
    const farm = await Farm.findOne({
      _id: req.body.farm,
      owner: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    const cropData = {
      ...req.body,
      farmer: req.user.userId
    };

    const crop = new Crop(cropData);
    await crop.save();

    await crop.populate([
      { path: 'farm', select: 'name location' },
      { path: 'farmer', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      crop
    });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    )
      .populate('farm', 'name location')
      .populate('farmer', 'name email');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      message: 'Crop updated successfully',
      crop
    });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add monitoring entry
// @route   POST /api/crops/:id/monitoring
// @access  Private
exports.addMonitoring = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.monitoring.push({
      ...req.body,
      date: new Date()
    });

    await crop.save();

    res.json({
      success: true,
      message: 'Monitoring entry added successfully',
      monitoring: crop.monitoring[crop.monitoring.length - 1]
    });
  } catch (error) {
    console.error('Add monitoring error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add fertilizer application
// @route   POST /api/crops/:id/fertilizer
// @access  Private
exports.addFertilizer = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.fertilizers.push({
      ...req.body,
      applicationDate: req.body.applicationDate || new Date()
    });

    await crop.save();

    res.json({
      success: true,
      message: 'Fertilizer application added successfully',
      fertilizer: crop.fertilizers[crop.fertilizers.length - 1]
    });
  } catch (error) {
    console.error('Add fertilizer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add pesticide application
// @route   POST /api/crops/:id/pesticide
// @access  Private
exports.addPesticide = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.pesticides.push({
      ...req.body,
      applicationDate: req.body.applicationDate || new Date()
    });

    await crop.save();

    res.json({
      success: true,
      message: 'Pesticide application added successfully',
      pesticide: crop.pesticides[crop.pesticides.length - 1]
    });
  } catch (error) {
    console.error('Add pesticide error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add expense
// @route   POST /api/crops/:id/expense
// @access  Private
exports.addExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.expenses.push({
      ...req.body,
      date: req.body.date || new Date()
    });

    await crop.save();

    res.json({
      success: true,
      message: 'Expense added successfully',
      expense: crop.expenses[crop.expenses.length - 1]
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};