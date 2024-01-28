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
router.put('/:id', verifyTokenAndAuthorization, changePassword);

// Delete user (admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteUser);

// Get user (admin only)
router.get('/:id', verifyTokenAndAdmin, getUser);

// Get all users (admin only)
router.get('/', verifyTokenAndAdmin, getAllUsers);

module.exports = router;
