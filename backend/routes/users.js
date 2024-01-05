const router = require('express').Router();
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../controllers/verifyToken');

const {
	changePassword,
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

// Change user details
router.put('/:id', verifyTokenAndAuthorization, changePassword);

// Delete user (admin only)
router.delete('/:id', verifyTokenAndAdmin, deleteUser);

// Get user (admin only)
router.get('/:id', verifyTokenAndAdmin, getUser);

// Get all users (admin only)
router.get('/', verifyTokenAndAdmin, getAllUsers);

module.exports = router;
