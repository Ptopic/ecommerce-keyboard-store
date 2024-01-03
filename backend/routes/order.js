const router = require('express').Router();

const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../controllers/verifyToken');

const {
	getIncome,
	createOrder,
	editOrder,
	deleteOrder,
	getUserOrder,
	getAllOrders,
	getOrderByOrderId,
} = require('../controllers/order');

// Get monthly income

router.get('/income', verifyTokenAndAdmin, getIncome);

// Create Order
router.post('/', verifyTokenAndAuthorization, createOrder);

// Get order by order id
router.get('/getByOrderId', getOrderByOrderId);

// Edit Order (admin only)
router.put('/:id', verifyTokenAndAdmin, editOrder);

// Delete Order (admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteOrder);

// Get user order
router.get('/find/:userId', verifyTokenAndAuthorization, getUserOrder);

// Get all orders (admin only)
router.get('/', verifyTokenAndAdmin, getAllOrders);

module.exports = router;
