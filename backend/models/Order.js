const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		receiptLink: {
			type: String,
		},
		products: [],
		amount: {
			type: Number,
		},
		shippingInfo: {
			type: Object,
		},
		billingInfo: {
			type: Object,
		},
		status: {
			type: String,
			default: 'Pending',
		},
		orderNumber: {
			type: String,
		},
		tvrtka: {
			type: String,
		},
		tvrtkaDostava: {
			type: String,
		},
		oib: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
