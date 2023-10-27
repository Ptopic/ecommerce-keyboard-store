const Wishlist = require('../models/wishlist');
const Product = require('../models/Product');
const ObjectId = require('mongodb').ObjectId;

exports.addToWishlist = async (req, res) => {
	const { userId, productId } = req.body;
	console.log(userId, productId);

	// Get product to add to wishlist
	const product = await Product.findById(productId);

	// Check if users wishlist already exists
	const existingWishlist = await Wishlist.findOne({ userId: userId });
	if (!existingWishlist) {
		// If not create a new wishlist
		const wishlist = new Wishlist({
			userId,
			products: [product],
		});

		try {
			const savedWishlist = await wishlist.save();
			return res.status(200).send({ success: true, data: savedWishlist });
		} catch (error) {
			return res.status(400).send({ success: false, error: error });
		}
	} else {
		try {
			await existingWishlist.updateOne({ $addToSet: { products: product } });
			return res
				.status(200)
				.send({ success: true, data: 'Product added to wishlist.' });
		} catch (error) {
			return res.status(400).send({ success: false, error: error });
		}
	}
};

exports.removeFromWishlist = async (req, res) => {
	const { userId, productId } = req.body;
	// Find wishlist by user id

	const existingWishlist = await Wishlist.findOne({ userId: userId });

	console.log(existingWishlist);
	// Remove product from wishlist
	await existingWishlist.updateOne({
		$pull: { products: { _id: new ObjectId(productId) } },
	});
	return res
		.status(201)
		.send({ success: true, data: 'Product removed from wishlist.' });
};

exports.getUserWishlist = async (req, res) => {
	const { userId } = req.query;
	try {
		const usersWishlist = await Wishlist.findOne({ userId: userId });
		console.log(usersWishlist);
		if (!usersWishlist) {
			// Create users wishlist if it doesn't exist
			const wishlist = new Wishlist({
				userId: userId,
				products: [],
			});

			try {
				await wishlist.save();
				return res
					.status(200)
					.send({ success: true, message: 'Users wishlist created.' });
			} catch (error) {
				return res.status(400).send({ success: false, error: error });
			}
		} else {
			return res.status(201).send({ success: true, data: usersWishlist });
		}
	} catch (error) {
		return res.status(400).send({ success: false, error: error });
	}
};
