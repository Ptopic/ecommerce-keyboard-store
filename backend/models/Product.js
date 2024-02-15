const mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;
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
		images: {
			type: Array,
			requried: true,
		},
		category: {
			type: String,
			requried: true,
		},
		details: {
			type: Object,
		},
		price: {
			type: Number,
			requried: true,
		},
		stock: {
			type: Number,
			default: 10,
		},
		colors: {
			type: Array,
		},
		sizes: {
			type: Array,
		},
		materials: {
			type: Array,
		},
		variationNames: {
			type: Array,
		},
		// size: {
		// 	type: Array,
		// },
		// material: {
		// 	type: Array,
		// },
		// type: {
		// 	type: Array,
		// },
		// color: {
		// 	type: Array,
		// },
		// inStock: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

productSchema.index({ title: 'text' });

module.exports = mongoose.model('Product', productSchema);
