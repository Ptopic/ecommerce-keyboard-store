const mongoose = require('mongoose');

const productVariationSchema = new mongoose.Schema(
	{
		productId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		stock: {
			type: Number,
			required: true,
		},
		images: {
			type: Array,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ProductVariation', productVariationSchema);
