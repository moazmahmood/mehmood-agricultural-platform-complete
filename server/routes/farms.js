const express = require('express');
const { body } = require('express-validator');
const farmController = require('../controllers/farmController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/farms
// @desc    Get all farms for current user
// @access  Private
router.get('/', farmController.getFarms);

// @route   GET /api/farms/:id
// @desc    Get farm by ID
// @access  Private
router.get('/:id', farmController.getFarmById);

// @route   POST /api/farms
// @desc    Create a new farm
// @access  Private
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Farm name must be between 2 and 100 characters'),
  body('location.address')
    .notEmpty()
    .withMessage('Farm address is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  body('area.value')
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number'),
  body('soilType')
    .isIn(['clay', 'sandy', 'loamy', 'silt', 'peaty', 'chalky'])
    .withMessage('Invalid soil type')
], farmController.createFarm);

// @route   PUT /api/farms/:id
// @desc    Update farm
// @access  Private
router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Farm name must be between 2 and 100 characters'),
  body('area.value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number'),
  body('soilType')
    .optional()
    .isIn(['clay', 'sandy', 'loamy', 'silt', 'peaty', 'chalky'])
    .withMessage('Invalid soil type')
], farmController.updateFarm);

// @route   DELETE /api/farms/:id
// @desc    Delete farm
// @access  Private
router.delete('/:id', farmController.deleteFarm);

module.exports = router;