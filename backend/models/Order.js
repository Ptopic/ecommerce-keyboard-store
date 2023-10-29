const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		receiptLink: {
			type: String,
			required: true,
		},
		products: [],
		amount: {
			type: Number,
			required: true,
		},
		addressInfo: {
			type: Object,
			required: true,
		},
		status: {
			type: String,
			default: 'Pending',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
