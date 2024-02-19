const router = require('express').Router();

const {
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../controllers/verifyToken');

const {
	createProduct,
	updateProduct,
	deleteProductImage,
	deleteProduct,
	searchProducts,
	getProduct,
	getAllProducts,
	getAllProductVariations,
	getAllProductsByCategory,
	getAllProductsForAdminPage,
	createOrUpdateProductVariants,
	getProductsMinMaxPrices,
	getProductsMinMaxPricesByCategory,
} = require('../controllers/products');

// Create product (admin only)
router.post('/', verifyTokenAndAdmin, createProduct);

// Update product (admin only)
router.put('/:id', verifyTokenAndAdmin, updateProduct);

// Delete product (admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);

// Delete product image (single) (admin only)
router.delete('/image/:id', verifyTokenAndAdmin, deleteProductImage);

// Search for product
router.get('/search', searchProducts);

// Get product
router.get('/find/:id', getProduct);

// Get all products
router.get('/all', getAllProducts);

// Get all products by category
router.get('/category/:category', getAllProductsByCategory);

// Get all products for admin page
router.get('/admin', verifyTokenAndAdmin, getAllProductsForAdminPage);

// Get all products min and max prices
router.get('/prices/all', getProductsMinMaxPrices);

// Get products min max prices by category
router.get('/prices/:category', getProductsMinMaxPricesByCategory);

// ---------- Product variants ----------

router.get('/variants/:id', verifyTokenAndAdmin, getAllProductVariations);

router.post('/variants', verifyTokenAndAdmin, createOrUpdateProductVariants);
module.exports = router;
