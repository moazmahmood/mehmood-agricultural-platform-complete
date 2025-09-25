const express = require('express');
const { body } = require('express-validator');
const {
  createCrop,
  getCrops,
  getCrop,
  updateCrop,
  deleteCrop,
  addMonitoring,
  addTreatment,
  getCropAnalytics
} = require('../controllers/cropController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const cropValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Crop name is required'),
  body('category')
    .isIn(['cereals', 'vegetables', 'fruits', 'legumes', 'oilseeds', 'spices', 'fiber', 'fodder'])
    .withMessage('Invalid crop category'),
  body('farm')
    .isMongoId()
    .withMessage('Valid farm ID is required'),
  body('field')
    .trim()
    .notEmpty()
    .withMessage('Field name is required'),
  body('plantingDate')
    .isISO8601()
    .withMessage('Valid planting date is required'),
  body('expectedHarvestDate')
    .isISO8601()
    .withMessage('Valid expected harvest date is required'),
  body('area.value')
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number')
];

const monitoringValidation = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required'),
  body('healthStatus')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor', 'diseased'])
    .withMessage('Invalid health status'),
  body('height')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Height must be a positive number')
];

const treatmentValidation = [
  body('type')
    .isIn(['fertilizer', 'pesticide', 'irrigation'])
    .withMessage('Treatment type must be fertilizer, pesticide, or irrigation'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Treatment name is required'),
  body('applicationDate')
    .optional()
    .isISO8601()
    .withMessage('Valid application date is required')
];

// Routes - all require authentication
router.use(auth);

router.get('/analytics', getCropAnalytics);
router.post('/', cropValidation, createCrop);
router.get('/', getCrops);
router.get('/:id', getCrop);
router.put('/:id', cropValidation, updateCrop);
router.delete('/:id', deleteCrop);

// Monitoring and treatments
router.post('/:id/monitoring', monitoringValidation, addMonitoring);
router.post('/:id/treatments', treatmentValidation, addTreatment);

module.exports = router;