const router = require('express').Router();

const express = require('express');
const {
	pay,
	stripeWebHook,
	generateProducts,
	generateProductPrices,
	listAllProducts,
	deleteAllProducts,
} = require('../controllers/stripe');

router.post('/payment', pay);
// router.post(
// 	'/webhook',
// 	express.raw({ type: 'application/json' }),
// 	stripeWebHook
// );
router.post('/generate-products', generateProducts, generateProductPrices);
router.get('/list-products', listAllProducts);
router.delete('/delete-all-products', deleteAllProducts);

module.exports = router;
