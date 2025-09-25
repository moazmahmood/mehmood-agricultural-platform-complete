const { validationResult } = require('express-validator');
const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

const createCrop = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify farm ownership
    const farm = await Farm.findById(req.body.farm);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const crop = new Crop(req.body);
    await crop.save();

    await crop.populate('farm', 'name location.address');

    res.status(201).json({
      message: 'Crop created successfully',
      crop
    });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ error: 'Server error during crop creation' });
  }
};

const getCrops = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, farm } = req.query;
    
    let query = {};
    
    // Build query based on user role and filters
    if (req.user.role !== 'admin') {
      // Get user's farms
      const userFarms = await Farm.find({ owner: req.user._id }).select('_id');
      const farmIds = userFarms.map(f => f._id);
      query.farm = { $in: farmIds };
    }

    if (farm) query.farm = farm;
    if (category) query.category = category;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } },
        { variety: { $regex: search, $options: 'i' } }
      ];
    }

    const crops = await Crop.find(query)
      .populate('farm', 'name location.address owner')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Crop.countDocuments(query);

    res.json({
      crops,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalCrops: total
    });
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ error: 'Server error while fetching crops' });
  }
};

const getCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farm', 'name location owner');

    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && crop.farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ crop });
  } catch (error) {
    console.error('Get crop error:', error);
    res.status(500).json({ error: 'Server error while fetching crop' });
  }
};

const updateCrop = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const crop = await Crop.findById(req.params.id).populate('farm', 'owner');

    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && crop.farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedCrop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('farm', 'name location.address');

    // Recalculate financials if needed
    if (req.body.financials) {
      updatedCrop.calculateTotalInvestment();
      updatedCrop.calculateProfit();
      await updatedCrop.save();
    }

    res.json({
      message: 'Crop updated successfully',
      crop: updatedCrop
    });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ error: 'Server error during crop update' });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farm', 'owner');

    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && crop.farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ error: 'Server error during crop deletion' });
  }
};

const addMonitoring = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farm', 'owner');

    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && crop.farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    crop.monitoring.push(req.body);
    await crop.save();

    res.status(201).json({
      message: 'Monitoring data added successfully',
      crop
    });
  } catch (error) {
    console.error('Add monitoring error:', error);
    res.status(500).json({ error: 'Server error while adding monitoring data' });
  }
};

const addTreatment = async (req, res) => {
  try {
    const { type } = req.body;
    const crop = await Crop.findById(req.params.id).populate('farm', 'owner');

    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && crop.farm.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (type === 'fertilizer') {
      crop.fertilizers.push(req.body);
    } else if (type === 'pesticide') {
      crop.pesticides.push(req.body);
    } else if (type === 'irrigation') {
      crop.irrigation.push(req.body);
    } else {
      return res.status(400).json({ error: 'Invalid treatment type' });
    }

    await crop.save();

    res.status(201).json({
      message: `${type} treatment added successfully`,
      crop
    });
  } catch (error) {
    console.error('Add treatment error:', error);
    res.status(500).json({ error: 'Server error while adding treatment' });
  }
};

const getCropAnalytics = async (req, res) => {
  try {
    let query = {};
    
    // Filter by user's farms if not admin
    if (req.user.role !== 'admin') {
      const userFarms = await Farm.find({ owner: req.user._id }).select('_id');
      const farmIds = userFarms.map(f => f._id);
      query.farm = { $in: farmIds };
    }

    const analytics = await Crop.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalCrops: { $sum: 1 },
          activeCrops: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          harvestedCrops: {
            $sum: { $cond: [{ $eq: ['$status', 'harvested'] }, 1, 0] }
          },
          totalInvestment: { $sum: '$financials.totalInvestment' },
          totalRevenue: { $sum: '$financials.revenue' },
          totalProfit: { $sum: '$financials.profit' },
          averageYield: { $avg: '$yield.actual.value' }
        }
      }
    ]);

    const categoryStats = await Crop.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalArea: { $sum: '$area.value' }
        }
      }
    ]);

    res.json({
      analytics: analytics[0] || {
        totalCrops: 0,
        activeCrops: 0,
        harvestedCrops: 0,
        totalInvestment: 0,
        totalRevenue: 0,
        totalProfit: 0,
        averageYield: 0
      },
      categoryStats
    });
  } catch (error) {
    console.error('Get crop analytics error:', error);
    res.status(500).json({ error: 'Server error while fetching analytics' });
  }
};

module.exports = {
  createCrop,
  getCrops,
  getCrop,
  updateCrop,
  deleteCrop,
  addMonitoring,
  addTreatment,
  getCropAnalytics
};