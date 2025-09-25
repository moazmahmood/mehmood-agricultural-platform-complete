const express = require('express');
const { body } = require('express-validator');
const cropController = require('../controllers/cropController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/crops
// @desc    Get all crops for current user
// @access  Private
router.get('/', cropController.getCrops);

// @route   GET /api/crops/:id
// @desc    Get crop by ID
// @access  Private
router.get('/:id', cropController.getCropById);

// @route   POST /api/crops
// @desc    Create a new crop
// @access  Private
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Crop name is required'),
  body('farm')
    .isMongoId()
    .withMessage('Valid farm ID is required'),
  body('plantingDate')
    .isISO8601()
    .withMessage('Valid planting date is required'),
  body('expectedHarvestDate')
    .isISO8601()
    .withMessage('Valid expected harvest date is required'),
  body('area.value')
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number')
], cropController.createCrop);

// @route   PUT /api/crops/:id
// @desc    Update crop
// @access  Private
router.put('/:id', cropController.updateCrop);

// @route   DELETE /api/crops/:id
// @desc    Delete crop
// @access  Private
router.delete('/:id', cropController.deleteCrop);

// @route   POST /api/crops/:id/monitoring
// @desc    Add monitoring entry
// @access  Private
router.post('/:id/monitoring', [
  body('healthScore')
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage('Health score must be between 1 and 10')
], cropController.addMonitoring);

// @route   POST /api/crops/:id/fertilizer
// @desc    Add fertilizer application
// @access  Private
router.post('/:id/fertilizer', cropController.addFertilizer);

// @route   POST /api/crops/:id/pesticide
// @desc    Add pesticide application
// @access  Private
router.post('/:id/pesticide', cropController.addPesticide);

// @route   POST /api/crops/:id/expense
// @desc    Add expense
// @access  Private
router.post('/:id/expense', [
  body('category')
    .isIn(['seeds', 'fertilizers', 'pesticides', 'labor', 'equipment', 'irrigation', 'other'])
    .withMessage('Invalid expense category'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number')
], cropController.addExpense);

module.exports = router;