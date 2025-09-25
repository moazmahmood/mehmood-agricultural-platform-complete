const express = require('express');
const { body } = require('express-validator');
const {
  createFarm,
  getFarms,
  getFarm,
  updateFarm,
  deleteFarm,
  addField,
  updateField
} = require('../controllers/farmController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const farmValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Farm name must be between 2 and 200 characters'),
  body('location.address')
    .notEmpty()
    .withMessage('Farm address is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('size.value')
    .isFloat({ min: 0 })
    .withMessage('Farm size must be a positive number'),
  body('size.unit')
    .isIn(['acres', 'hectares', 'square_meters', 'square_feet'])
    .withMessage('Invalid size unit'),
  body('soilType')
    .isIn(['clay', 'sandy', 'loam', 'silt', 'peat', 'chalk'])
    .withMessage('Invalid soil type')
];

const fieldValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Field name is required'),
  body('size.value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Field size must be a positive number')
];

// Routes - all require authentication
router.use(auth);

router.post('/', farmValidation, createFarm);
router.get('/', getFarms);
router.get('/:id', getFarm);
router.put('/:id', farmValidation, updateFarm);
router.delete('/:id', deleteFarm);

// Field management
router.post('/:id/fields', fieldValidation, addField);
router.put('/:id/fields/:fieldId', fieldValidation, updateField);

module.exports = router;