const router = require('express').Router();

const {
	verifyToken,
	verifyTokenAuthenticity,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../controllers/verifyToken');

const {
	getAllCategories,
	getCategoryById,
	getCategoryByName,
	createCategory,
	editCategory,
	deleteCategory,
} = require('../controllers/category');

// Get all categories (Admin only)
router.get('/', getAllCategories);

// Get category by id (Admin only)
router.get('/:id', verifyTokenAndAdmin, getCategoryById);

// Get categiry by name
router.get('/name/:name', getCategoryByName);

// Get all products of a category (Admin only)
// router.get('/:id/products', verifyTokenAndAdmin);

// Create category (Admin only)
router.post('/', verifyTokenAndAdmin, createCategory);

// Edit category (Admin only)
router.put('/:id', verifyTokenAndAdmin, editCategory);

// Delete category (Admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteCategory);

module.exports = router;
