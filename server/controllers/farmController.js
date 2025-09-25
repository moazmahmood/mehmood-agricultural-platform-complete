const { validationResult } = require('express-validator');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

// @desc    Get all farms for current user
// @route   GET /api/farms
// @access  Private
exports.getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user.userId })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: farms.length,
      farms
    });
  } catch (error) {
    console.error('Get farms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get farm by ID
// @route   GET /api/farms/:id
// @access  Private
exports.getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      owner: req.user.userId
    }).populate('owner', 'name email');

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Get crops for this farm
    const crops = await Crop.find({ farm: farm._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      farm: {
        ...farm.toObject(),
        crops
      }
    });
  } catch (error) {
    console.error('Get farm by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private
exports.createFarm = async (req, res) => {
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

    const farmData = {
      ...req.body,
      owner: req.user.userId
    };

    const farm = new Farm(farmData);
    await farm.save();

    await farm.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      farm
    });
  } catch (error) {
    console.error('Create farm error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Farm with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
exports.updateFarm = async (req, res) => {
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

    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    res.json({
      success: true,
      message: 'Farm updated successfully',
      farm
    });
  } catch (error) {
    console.error('Update farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
exports.deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Check if farm has active crops
    const activeCrops = await Crop.countDocuments({
      farm: farm._id,
      status: 'active'
    });

    if (activeCrops > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete farm with active crops'
      });
    }

    await Farm.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Farm deleted successfully'
    });
  } catch (error) {
    console.error('Delete farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};