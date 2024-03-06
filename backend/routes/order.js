const router = require('express').Router();

const {
	verifyToken,
	verifyTokenAuthenticity,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../controllers/verifyToken');

const {
	getIncome,
	createOrder,
	editOrder,
	deleteOrder,
	getUserOrders,
	getAllOrders,
	getOrderByOrderId,
	getOrdersCount,
} = require('../controllers/order');

// Get orders count
router.get('/count', verifyTokenAndAdmin, getOrdersCount);

// Get monthly income

router.get('/income', verifyTokenAndAdmin, getIncome);

// Create Order
router.post('/', verifyTokenAndAdmin, createOrder);

// Get order by order id
router.get('/getByOrderId', getOrderByOrderId);

// Edit Order (admin only)
router.put('/:id', verifyTokenAndAdmin, editOrder);

// Delete Order (admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteOrder);

// Get user order
router.get('/find/:userId', verifyTokenAuthenticity, getUserOrders);

// Get all orders (admin only)
router.get('/', verifyTokenAndAdmin, getAllOrders);

module.exports = router;
