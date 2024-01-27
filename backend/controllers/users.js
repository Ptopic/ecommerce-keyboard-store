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

exports.getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...otherInfo } = user._doc;
		return res.status(200).send({ success: true, data: otherInfo });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllUsers = async (req, res) => {
	const query = req.query.new;
	try {
		const users = query
			? await User.find().sort({ _id: -1 }).limit(5)
			: await User.find();
		return res.status(200).send({ success: true, data: users });
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
