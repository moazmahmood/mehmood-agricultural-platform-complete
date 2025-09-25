const { validationResult } = require('express-validator');
const Farm = require('../models/Farm');

const createFarm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const farmData = {
      ...req.body,
      owner: req.user._id
    };

    const farm = new Farm(farmData);
    await farm.save();

    await farm.populate('owner', 'name email');

    res.status(201).json({
      message: 'Farm created successfully',
      farm
    });
  } catch (error) {
    console.error('Create farm error:', error);
    res.status(500).json({ error: 'Server error during farm creation' });
  }
};

const getFarms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    // If user is not admin, only show their farms
    if (req.user.role !== 'admin') {
      query.owner = req.user._id;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    const farms = await Farm.find(query)
      .populate('owner', 'name email')
      .populate('fields.currentCrop', 'name category growthStage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Farm.countDocuments(query);

    res.json({
      farms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalFarms: total
    });
  } catch (error) {
    console.error('Get farms error:', error);
    res.status(500).json({ error: 'Server error while fetching farms' });
  }
};

const getFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('fields.currentCrop', 'name category growthStage plantingDate expectedHarvestDate');

    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Check if user has access to this farm
    if (req.user.role !== 'admin' && farm.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ farm });
  } catch (error) {
    console.error('Get farm error:', error);
    res.status(500).json({ error: 'Server error while fetching farm' });
  }
};

const updateFarm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Check if user has access to this farm
    if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedFarm = await Farm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json({
      message: 'Farm updated successfully',
      farm: updatedFarm
    });
  } catch (error) {
    console.error('Update farm error:', error);
    res.status(500).json({ error: 'Server error during farm update' });
  }
};

const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Check if user has access to this farm
    if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Farm.findByIdAndDelete(req.params.id);

    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    console.error('Delete farm error:', error);
    res.status(500).json({ error: 'Server error during farm deletion' });
  }
};

const addField = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Check if user has access to this farm
    if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    farm.fields.push(req.body);
    await farm.save();

    res.status(201).json({
      message: 'Field added successfully',
      farm
    });
  } catch (error) {
    console.error('Add field error:', error);
    res.status(500).json({ error: 'Server error while adding field' });
  }
};

const updateField = async (req, res) => {
  try {
    const { id, fieldId } = req.params;
    
    const farm = await Farm.findById(id);

    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Check if user has access to this farm
    if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const field = farm.fields.id(fieldId);
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    Object.assign(field, req.body);
    await farm.save();

    res.json({
      message: 'Field updated successfully',
      farm
    });
  } catch (error) {
    console.error('Update field error:', error);
    res.status(500).json({ error: 'Server error while updating field' });
  }
};

module.exports = {
  createFarm,
  getFarms,
  getFarm,
  updateFarm,
  deleteFarm,
  addField,
  updateField
};