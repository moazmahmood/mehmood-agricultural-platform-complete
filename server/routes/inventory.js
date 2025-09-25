const express = require('express');
const { body } = require('express-validator');
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', inventoryController.getInventoryItems);

// @route   GET /api/inventory/:id
// @desc    Get inventory item by ID
// @access  Private
router.get('/:id', inventoryController.getInventoryItemById);

// @route   POST /api/inventory
// @desc    Create new inventory item
// @access  Private
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required'),
  body('category')
    .isIn(['seeds', 'fertilizers', 'pesticides', 'equipment', 'tools', 'other'])
    .withMessage('Invalid category'),
  body('quantity')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required')
], inventoryController.createInventoryItem);

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
// @access  Private
router.put('/:id', inventoryController.updateInventoryItem);

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
// @access  Private
router.delete('/:id', inventoryController.deleteInventoryItem);

// @route   POST /api/inventory/:id/usage
// @desc    Record inventory usage
// @access  Private
router.post('/:id/usage', [
  body('quantity')
    .isFloat({ min: 0 })
    .withMessage('Usage quantity must be a positive number'),
  body('purpose')
    .trim()
    .notEmpty()
    .withMessage('Purpose is required')
], inventoryController.recordUsage);

module.exports = router;