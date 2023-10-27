const router = require('express').Router();

const {
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../controllers/verifyToken');

const {
	createProduct,
	updateProduct,
	deleteProduct,
	getProduct,
	getAllProducts,
} = require('../controllers/products');

// Create product (admin only)
router.post('/', verifyTokenAndAdmin, createProduct);

// Update product (admin only)
router.put('/:id', verifyTokenAndAdmin, updateProduct);

// Delete product (admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);

// Get product
router.get('/find/:id', getProduct);

// Get all products
router.get('/', getAllProducts);
module.exports = router;
