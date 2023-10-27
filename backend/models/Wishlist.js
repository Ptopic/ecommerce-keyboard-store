const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		products: {
			type: Array,
			requried: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
