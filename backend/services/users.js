// Models
const User = require('../models/User');

exports.getUserById = async (userId) => {
	const user = await User.findById(userId);
	return user;
};

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

exports.getUserCount = async () => {
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
	return usersCount;
};

exports.getTotalUsers = async (search, userId) => {
	let totalUsers;
	// If search query is not empty, get total number of orders that match search query
	if (search != '') {
		totalUsers = await User.find({
			email: { $regex: search, $options: 'i' },
		}).count();
	} else {
		totalUsers = await User.find({ userId: userId }).count();
	}
	return totalUsers;
};

exports.getUsersCountByYear = async (lastYear) => {
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

	return data;
};

exports.getAllUsers = async (sort, direction, page, pageSize, search) => {
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
	return users;
};

exports.editUserInfo = async (
	userId,
	firstName,
	lastName,
	shippingInfo,
	billingInfo,
	tvrtka,
	tvrtkaDostava,
	oib
) => {
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

	return updatedUser;
};

exports.changeUserPassword = async (id, encryptedPassword) => {
	await User.findByIdAndUpdate(
		{ _id: id },
		{ password: encryptedPassword },
		{ new: true }
	);
};
