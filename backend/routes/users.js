const router = require('express').Router();
const {
	verifyToken,
	verifyTokenAuthenticity,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../controllers/verifyToken');

const {
	userChangePassword,
	changePassword,
	changeUserInfo,
	createUser,
	editUser,
	deleteUser,
	getUser,
	getAllUsers,
	getUserStats,
	getCount,
} = require('../controllers/users');

// Get users count (admin only)
router.get('/count', verifyTokenAndAdmin, getCount);

// Get user stats (admin only)
router.get('/stats', verifyTokenAndAdmin, getUserStats);

// User change password
router.put('/changePassword', userChangePassword);

// User change details
router.put('/changeUserInfo', verifyTokenAuthenticity, changeUserInfo);

// Change user password
router.put('/:id', verifyTokenAndAdmin, changePassword);

// Get user
router.get('/:id', verifyTokenAuthenticity, getUser);

// Get all users (admin only)
router.get('/', verifyTokenAndAdmin, getAllUsers);

// Create user (admin only)
router.post('/add', verifyTokenAndAdmin, createUser);

// Edit user (admin only)
router.put('/edit/:id', verifyTokenAndAdmin, editUser);

// Delete user (admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteUser);

module.exports = router;
