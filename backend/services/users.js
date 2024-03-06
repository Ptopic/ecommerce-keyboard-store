// Models
const User = require('../models/User');

exports.getUserByEmail = async (email) => {
	const user = await User.findOne({
		email: email,
	});

	return user;
};

exports.getUserByUsername = async (username) => {
	const checkUsername = await User.findOne({ username: username });
	return checkUsername;
};

exports.changeUserPassword = async (id, encryptedPassword) => {
	await User.findByIdAndUpdate(
		{ _id: id },
		{ password: encryptedPassword },
		{ new: true }
	);
};
