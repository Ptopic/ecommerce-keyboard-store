const router = require('express').Router();
const {
	verifyToken,
	verifyTokenAuthenticity,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../controllers/verifyToken');

const {
	createCart,
	editCart,
	deleteCart,
	getUserCart,
	getAllCarts,
} = require('../controllers/cart');

// Create cart
router.post('/', verifyTokenAuthenticity, createCart);

// Edit cart
router.put('/:id', verifyTokenAuthenticity, editCart);

// Delete cart
router.delete('/:id', verifyTokenAuthenticity, deleteCart);

// Get user cart
router.get('/find/:userId', verifyTokenAuthenticity, getUserCart);

// Get all carts
router.get('/', verifyTokenAndAdmin, getAllCarts);

module.exports = router;
