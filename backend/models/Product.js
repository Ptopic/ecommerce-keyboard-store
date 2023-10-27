const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			requried: true,
		},
		image: {
			type: Array,
			requried: true,
		},
		categories: {
			type: Array,
			requried: true,
		},
		size: {
			type: Array,
		},
		material: {
			type: Array,
		},
		type: {
			type: Array,
		},
		color: {
			type: Array,
		},
		price: {
			type: Number,
			requried: true,
		},
		stock: {
			type: Number,
			default: 10,
		},
		inStock: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
