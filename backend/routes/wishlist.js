const router = require('express').Router();

const { verifyTokenAuthenticity } = require('../controllers/verifyToken');

const {
	addToWishlist,
	removeFromWishlist,
	getUserWishlist,
} = require('../controllers/wishlist');

router.post('/wishlist', verifyTokenAuthenticity, addToWishlist);
router.delete('/wishlist', verifyTokenAuthenticity, removeFromWishlist);
router.get('/wishlist', getUserWishlist);

module.exports = router;
