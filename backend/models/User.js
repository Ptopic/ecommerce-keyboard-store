const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		googleId: {
			type: String,
		},
		image: {
			type: String,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			requried: true,
			unique: true,
		},
		password: {
			type: String,
			requried: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		shippingInfo: {
			type: Object,
			default: null,
		},
		billingInfo: {
			type: Object,
			default: null,
		},
		tvrtka: {
			type: String,
			default: '',
		},
		tvrtkaDostava: {
			type: String,
			default: '',
		},
		oib: {
			type: String,
			default: '',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
