const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
	{
		_id: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		receiptLink: {
			type: String,
		},
		products: [],
		amount: {
			type: Number,
			required: true,
		},
		shippingInfo: {
			type: Object,
			required: true,
		},
		billingInfo: {
			type: Object,
			required: true,
		},
		status: {
			type: String,
			default: 'Pending',
		},
	},
	{ _id: false, timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
