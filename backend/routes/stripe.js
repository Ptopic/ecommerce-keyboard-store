const router = require('express').Router();

const {
	pay,
	generateProducts,
	generateProductPrices,
	listAllProducts,
	deleteAllProducts,
} = require('../controllers/stripe');

router.post('/payment', pay);
router.post('/generate-products', generateProducts, generateProductPrices);
router.get('/list-products', listAllProducts);
router.delete('/delete-all-products', deleteAllProducts);

module.exports = router;
