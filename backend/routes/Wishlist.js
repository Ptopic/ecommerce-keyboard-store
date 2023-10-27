const router = require('express').Router();

const { verifyTokenAndAuthorization } = require('../controllers/verifyToken');

const {
	addToWishlist,
	removeFromWishlist,
	getUserWishlist,
} = require('../controllers/wishlist');

router.post('/wishlist', verifyTokenAndAuthorization, addToWishlist);
router.delete('/wishlist', verifyTokenAndAuthorization, removeFromWishlist);
router.get('/wishlist', getUserWishlist);

module.exports = router;
