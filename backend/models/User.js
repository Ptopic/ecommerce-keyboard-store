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
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
