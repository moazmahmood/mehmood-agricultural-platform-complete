const { validationResult } = require('express-validator');
const Inventory = require('../models/Inventory');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getInventoryItems = async (req, res) => {
  try {
    const { category, status, farm, search } = req.query;
    const filter = { owner: req.user.userId, isActive: true };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (farm) filter.farm = farm;

    let query = Inventory.find(filter);

    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    const items = await query
      .populate('farm', 'name')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Get inventory items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get inventory item by ID
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryItemById = async (req, res) => {
  try {
    const item = await Inventory.findOne({
      _id: req.params.id,
      owner: req.user.userId
    })
      .populate('farm', 'name location')
      .populate('owner', 'name email')
      .populate('usage.crop', 'name')
      .populate('usage.recordedBy', 'name');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      item
    });
  } catch (error) {
    console.error('Get inventory item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private
exports.createInventoryItem = async (req, res) => {
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

    const itemData = {
      ...req.body,
      owner: req.user.userId,
      quantity: {
        current: req.body.quantity,
        initial: req.body.quantity,
        minimum: req.body.minimumQuantity || 0
      }
    };

    if (req.body.unitPrice && req.body.quantity) {
      itemData.cost = {
        unitPrice: req.body.unitPrice,
        totalCost: req.body.unitPrice * req.body.quantity,
        currency: req.body.currency || 'USD'
      };
    }

    const item = new Inventory(itemData);
    await item.save();

    await item.populate([
      { path: 'farm', select: 'name' },
      { path: 'owner', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      item
    });
  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
exports.updateInventoryItem = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Handle quantity updates
    if (updates.quantity !== undefined) {
      updates['quantity.current'] = updates.quantity;
      delete updates.quantity;
    }

    if (updates.minimumQuantity !== undefined) {
      updates['quantity.minimum'] = updates.minimumQuantity;
      delete updates.minimumQuantity;
    }

    // Handle cost updates
    if (updates.unitPrice !== undefined) {
      updates['cost.unitPrice'] = updates.unitPrice;
      delete updates.unitPrice;
    }

    const item = await Inventory.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      updates,
      { new: true, runValidators: true }
    )
      .populate('farm', 'name')
      .populate('owner', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Soft delete by setting isActive to false
    item.isActive = false;
    await item.save();

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Record inventory usage
// @route   POST /api/inventory/:id/usage
// @access  Private
exports.recordUsage = async (req, res) => {
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

    const item = await Inventory.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const { quantity, purpose, crop, notes } = req.body;

    // Check if there's enough quantity
    if (quantity > item.quantity.current) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient quantity in inventory'
      });
    }

    // Add usage record
    item.usage.push({
      quantity,
      purpose,
      crop,
      notes,
      recordedBy: req.user.userId
    });

    // Update current quantity
    item.quantity.current -= quantity;

    await item.save();

    res.json({
      success: true,
      message: 'Usage recorded successfully',
      usage: item.usage[item.usage.length - 1],
      remainingQuantity: item.quantity.current
    });
  } catch (error) {
    console.error('Record usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};