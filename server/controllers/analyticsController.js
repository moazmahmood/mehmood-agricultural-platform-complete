const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const mongoose = require('mongoose');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get basic counts
    const [farmCount, cropCount, activeCropCount] = await Promise.all([
      Farm.countDocuments({ owner: userId }),
      Crop.countDocuments({ farmer: userId }),
      Crop.countDocuments({ farmer: userId, status: 'active' })
    ]);

    // Get total farm area
    const farmAreas = await Farm.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalArea: { $sum: '$area.value' } } }
    ]);

    const totalFarmArea = farmAreas.length > 0 ? farmAreas[0].totalArea : 0;

    // Get crop status distribution
    const cropStatusDistribution = await Crop.aggregate([
      { $match: { farmer: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get recent activities (last 10 crops)
    const recentCrops = await Crop.find({ farmer: userId })
      .populate('farm', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name farm plantingDate growthStage status');

    // Get monthly crop plantings for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyPlantings = await Crop.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(userId),
          plantingDate: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$plantingDate' },
            month: { $month: '$plantingDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        summary: {
          farmCount,
          cropCount,
          activeCropCount,
          totalFarmArea
        },
        cropStatusDistribution,
        recentCrops,
        monthlyPlantings
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get crop analytics
// @route   GET /api/analytics/crops
// @access  Private
exports.getCropAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { farmId, timeframe = '12months' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (timeframe) {
      case '1month':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
        break;
      case '3months':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 3)) };
        break;
      case '6months':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 6)) };
        break;
      case '12months':
      default:
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 12)) };
        break;
    }

    const matchFilter = {
      farmer: new mongoose.Types.ObjectId(userId),
      plantingDate: dateFilter
    };

    if (farmId) {
      matchFilter.farm = new mongoose.Types.ObjectId(farmId);
    }

    // Crop type distribution
    const cropTypeDistribution = await Crop.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$name', count: { $sum: 1 }, totalArea: { $sum: '$area.value' } } },
      { $sort: { count: -1 } }
    ]);

    // Growth stage distribution
    const growthStageDistribution = await Crop.aggregate([
      { $match: { farmer: new mongoose.Types.ObjectId(userId), status: 'active' } },
      { $group: { _id: '$growthStage', count: { $sum: 1 } } }
    ]);

    // Health status distribution
    const healthStatusDistribution = await Crop.aggregate([
      { $match: { farmer: new mongoose.Types.ObjectId(userId), status: 'active' } },
      { $group: { _id: '$healthStatus', count: { $sum: 1 } } }
    ]);

    // Average crop cycle duration
    const completedCrops = await Crop.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          actualHarvestDate: { $exists: true }
        }
      },
      {
        $project: {
          cycleDuration: {
            $divide: [
              { $subtract: ['$actualHarvestDate', '$plantingDate'] },
              86400000 // Convert ms to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageDuration: { $avg: '$cycleDuration' },
          minDuration: { $min: '$cycleDuration' },
          maxDuration: { $max: '$cycleDuration' }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        cropTypeDistribution,
        growthStageDistribution,
        healthStatusDistribution,
        averageCycleDuration: completedCrops[0] || null
      }
    });
  } catch (error) {
    console.error('Get crop analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get financial analytics
// @route   GET /api/analytics/financial
// @access  Private
exports.getFinancialAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { farmId, timeframe = '12months' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (timeframe) {
      case '1month':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
        break;
      case '3months':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 3)) };
        break;
      case '6months':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 6)) };
        break;
      case '12months':
      default:
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 12)) };
        break;
    }

    const matchFilter = {
      farmer: new mongoose.Types.ObjectId(userId),
      createdAt: dateFilter
    };

    if (farmId) {
      matchFilter.farm = new mongoose.Types.ObjectId(farmId);
    }

    // Total expenses by category
    const expensesByCategory = await Crop.aggregate([
      { $match: matchFilter },
      { $unwind: '$expenses' },
      {
        $group: {
          _id: '$expenses.category',
          total: { $sum: '$expenses.amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Monthly financial trends
    const monthlyFinancials = await Crop.aggregate([
      { $match: matchFilter },
      { $unwind: '$expenses' },
      {
        $group: {
          _id: {
            year: { $year: '$expenses.date' },
            month: { $month: '$expenses.date' }
          },
          totalExpenses: { $sum: '$expenses.amount' },
          totalRevenue: {
            $sum: {
              $cond: [{ $gt: ['$revenue.totalRevenue', 0] }, '$revenue.totalRevenue', 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Profit analysis for completed crops
    const profitAnalysis = await Crop.aggregate([
      {
        $match: {
          farmer: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          'revenue.totalRevenue': { $gt: 0 }
        }
      },
      {
        $project: {
          name: 1,
          totalExpenses: { $sum: '$expenses.amount' },
          totalRevenue: '$revenue.totalRevenue',
          profit: {
            $subtract: ['$revenue.totalRevenue', { $sum: '$expenses.amount' }]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$profit' },
          averageProfit: { $avg: '$profit' },
          totalRevenue: { $sum: '$totalRevenue' },
          totalExpenses: { $sum: '$totalExpenses' },
          profitableCrops: {
            $sum: { $cond: [{ $gt: ['$profit', 0] }, 1, 0] }
          },
          totalCrops: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        expensesByCategory,
        monthlyFinancials,
        profitAnalysis: profitAnalysis[0] || null
      }
    });
  } catch (error) {
    console.error('Get financial analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get yield analytics
// @route   GET /api/analytics/yield
// @access  Private
exports.getYieldAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { farmId, cropType } = req.query;

    const matchFilter = {
      farmer: new mongoose.Types.ObjectId(userId),
      status: 'completed',
      'yield.actual.value': { $gt: 0 }
    };

    if (farmId) {
      matchFilter.farm = new mongoose.Types.ObjectId(farmId);
    }

    if (cropType) {
      matchFilter.name = cropType;
    }

    // Yield performance by crop type
    const yieldByCropType = await Crop.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$name',
          averageYield: { $avg: '$yield.actual.value' },
          totalYield: { $sum: '$yield.actual.value' },
          cropCount: { $sum: 1 },
          averageExpected: { $avg: '$yield.expected.value' }
        }
      },
      {
        $project: {
          _id: 1,
          averageYield: 1,
          totalYield: 1,
          cropCount: 1,
          averageExpected: 1,
          yieldEfficiency: {
            $multiply: [
              { $divide: ['$averageYield', '$averageExpected'] },
              100
            ]
          }
        }
      },
      { $sort: { averageYield: -1 } }
    ]);

    // Yield trends over time
    const yieldTrends = await Crop.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            year: { $year: '$actualHarvestDate' },
            month: { $month: '$actualHarvestDate' }
          },
          averageYield: { $avg: '$yield.actual.value' },
          totalYield: { $sum: '$yield.actual.value' },
          cropCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top performing farms by yield
    const topFarmsByYield = await Crop.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$farm',
          averageYield: { $avg: '$yield.actual.value' },
          totalYield: { $sum: '$yield.actual.value' },
          cropCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'farms',
          localField: '_id',
          foreignField: '_id',
          as: 'farmDetails'
        }
      },
      { $unwind: '$farmDetails' },
      {
        $project: {
          farmName: '$farmDetails.name',
          averageYield: 1,
          totalYield: 1,
          cropCount: 1
        }
      },
      { $sort: { averageYield: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      analytics: {
        yieldByCropType,
        yieldTrends,
        topFarmsByYield
      }
    });
  } catch (error) {
    console.error('Get yield analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};