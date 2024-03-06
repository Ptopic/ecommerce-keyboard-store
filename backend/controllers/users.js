const User = require('../models/User');
const bcrypt = require('bcrypt');
const {
	getUserCount,
	changeUserPassword,
	editUserInfo,
	getUserById,
	getTotalUsers,
	getAllUsers,
	getUsersCountByYear,
	getUserByEmail,
	getUserByUsername,
} = require('../services/users');

exports.getCount = async (req, res) => {
	try {
		const usersCount = await getUserCount();
		return res.status(200).send({ success: true, data: usersCount });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.changePassword = async (req, res) => {
	const { id } = req.params;
	const hashedPassword = await bcrypt.hash(req.body.password, 8);

	try {
		const updatedUser = await changeUserPassword(id, hashedPassword);
		return res.status(200).send({ success: true, data: updatedUser });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.userChangePassword = async (req, res) => {
	const { userId, currentPassword, newPassword } = req.body;
	const user = await getUserById(userId);

	const isMatch = await bcrypt.compare(currentPassword, user.password);
	if (!isMatch) {
		return res
			.status(400)
			.send({ success: false, error: 'Invalid Current Password' });
	} else if (currentPassword === newPassword) {
		return res.status(400).send({
			success: false,
			error: 'Your current password and new password cant be the same',
		});
	}
	const hashedPassword = await bcrypt.hash(newPassword, 8);

	try {
		const updatedUser = await changeUserPassword(userId, hashedPassword);
		return res.status(200).send({ success: true, data: updatedUser });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.changeUserInfo = async (req, res) => {
	const {
		userId,
		firstName,
		lastName,
		shippingInfo,
		billingInfo,
		tvrtka,
		tvrtkaDostava,
		oib,
	} = req.body;

	try {
		const updatedUser = await editUserInfo(
			userId,
			firstName,
			lastName,
			shippingInfo,
			billingInfo,
			tvrtka,
			tvrtkaDostava,
			oib
		);

		return res.status(200).send({ success: true, data: updatedUser });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await getUserById(id);
		// Seperate password from other info to hide it
		const { password, ...otherInfo } = user._doc;
		return res.status(200).send({ success: true, data: otherInfo });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllUsers = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;
	const { userId } = req.params;

	// Get total number of orders
	let totalUsers = await getTotalUsers(search, userId);

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalUsers / pageSize);

	try {
		let users = await getAllUsers(sort, direction, page, pageSize, search);

		return res.status(200).send({
			success: true,
			data: users,
			totalUsers: totalUsers,
			totalPages: totalPages,
		});
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getUserStats = async (req, res) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear - 1));

	try {
		const data = await getUsersCountByYear(lastYear);
		return res.status(200).send({ success: true, data: data });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

// Create user
exports.createUser = async (req, res) => {
	let { firstName, lastName, username, email, password, isAdmin } = req.body;

	// Check if user with that username existst
	const checkUsername = await getUserByUsername(username);
	if (checkUsername)
		return res.status(400).send({
			success: false,
			error: 'User with that username already exists.',
		});

	// Check if user with that email exists
	const checkEmail = await getUserByEmail(email);
	if (checkEmail)
		return res.status(400).send({
			success: false,
			error: 'User with that email already exists.',
		});

	try {
		// Hash password
		password = await bcrypt.hash(password, 8);

		const user = new User({
			firstName: firstName,
			lastName: lastName,
			username: username,
			email: email,
			password: password,
			isAdmin: isAdmin,
		});

		const newUser = await user.save();
		return res.status(200).send({ success: true, data: newUser });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.editUser = async (req, res) => {
	let { firstName, lastName, username, email, password, isAdmin } = req.body;
	const { id } = req.params;

	// Hash password
	if (password != '') {
		password = await bcrypt.hash(password, 8);
	} else {
		// Get old password
		const user = await getUserById(id);
		password = user.password;
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				$set: {
					firstName: firstName,
					lastName: lastName,
					username: username,
					email: email,
					password: password,
					isAdmin: isAdmin,
				},
			},
			{ new: true }
		);

		return res.status(200).send({ success: true, data: updatedUser });
	} catch (err) {
		console.log(err);
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		return res
			.status(200)
			.send({ success: true, data: 'User has been deleted' });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};
