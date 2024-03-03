const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getCount = async (req, res) => {
	try {
		const usersCount = await User.aggregate([
			{
				$group: {
					_id: {
						month: { $month: '$createdAt' },
						year: { $year: '$createdAt' },
					},
					usersCount: { $sum: 1 },
				},
			},
		]);
		return res.status(200).send({ success: true, data: usersCount });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.changePassword = async (req, res) => {
	req.body.password = await bcrypt.hash(req.body.password, 8);

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		return res.status(200).send({ success: true, data: updatedUser });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.userChangePassword = async (req, res) => {
	const { userId, currentPassword, newPassword } = req.body;
	const user = await User.findById(userId);

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
	try {
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				$set: { password: await bcrypt.hash(newPassword, 8) },
			},
			{ new: true }
		);
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
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				$set: {
					firstName: firstName,
					lastName: lastName,
					shippingInfo: shippingInfo,
					billingInfo: billingInfo,
					tvrtka: tvrtka,
					tvrtkaDostava: tvrtkaDostava,
					oib: oib,
				},
			},
			{ new: true }
		);

		return res.status(200).send({ success: true, data: updatedUser });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getUser = async (req, res) => {
	console.log(req.params.id);
	try {
		const user = await User.findById(req.params.id);
		// Seperate password from other info to hide it
		const { password, ...otherInfo } = user._doc;
		return res.status(200).send({ success: true, data: otherInfo });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllUsers = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;

	// Get total number of orders
	let totalUsers;
	// If search query is not empty, get total number of orders that match search query
	if (search != '') {
		totalUsers = await User.find({
			email: { $regex: search, $options: 'i' },
		}).count();
	} else {
		totalUsers = await User.find({ userId: req.params.userId }).count();
	}

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalUsers / pageSize);

	try {
		let users;
		if (page && pageSize && sort && direction && search != '') {
			users = await User.find({
				email: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize && search != '') {
			users = await User.find({
				email: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort && direction && search != '') {
			users = await User.find({
				email: { $regex: search, $options: 'i' },
			}).sort([[sort, direction]]);
		} else if (page && pageSize && sort && direction) {
			users = await User.find()
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize) {
			users = await User.find()
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort && direction) {
			users = await User.find().sort([[sort, direction]]);
		} else {
			users = await User.find();
		}
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
		const data = await User.aggregate([
			{
				$match: { createdAt: { $gte: lastYear } },
			},
			{
				$project: {
					month: { $month: '$createdAt' },
				},
			},
			{
				$group: {
					_id: '$month',
					total: { $sum: 1 },
				},
			},
		]);
		return res.status(200).send({ success: true, data: data });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

// Create user
exports.createUser = async (req, res) => {
	let { firstName, lastName, username, email, password, isAdmin } = req.body;

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

	// Check if user with that username existst
	const checkUsername = await User.findOne({ username: req.body.username });
	if (checkUsername)
		return res.status(400).send({
			success: false,
			error: 'User with that username already exists.',
		});

	// Check if user with that email exists
	const checkEmail = await User.findOne({
		email: req.body.email,
	});
	if (checkEmail)
		return res.status(400).send({
			success: false,
			error: 'User with that email already exists.',
		});

	try {
		const newUser = await user.save();
		return res.status(200).send({ success: true, data: newUser });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.editUser = async (req, res) => {
	let { firstName, lastName, username, email, password, isAdmin } = req.body;
	console.log(req.body);

	// Hash password
	if (password != '') {
		password = await bcrypt.hash(password, 8);
	} else {
		// Get old password
		const user = await User.findById(req.params.id);
		password = user.password;
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
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

		console.log(updatedUser);

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
