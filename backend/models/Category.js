const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	fields: [],
});

module.exports = mongoose.model('Category', categorySchema);
