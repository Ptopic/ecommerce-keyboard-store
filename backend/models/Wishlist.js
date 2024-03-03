const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			unique: false,
		},
		products: {
			type: Array,
			requried: true,
			unique: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
