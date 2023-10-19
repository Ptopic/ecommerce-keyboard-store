const router = require('express').Router();
const {
	verifyToken,
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
router.post('/', verifyTokenAndAuthorization, createCart);

// Edit cart
router.put('/:id', verifyTokenAndAuthorization, editCart);

// Delete cart
router.delete('/:id', verifyTokenAndAuthorization, deleteCart);

// Get user cart
router.get('/find/:userId', verifyTokenAndAuthorization, getUserCart);

// Get all carts
router.get('/', verifyTokenAndAdmin, getAllCarts);

module.exports = router;
