const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.changePassword = async (req, res) => {
	if (req.body.password) {
		req.body.password = await bcrypt.hash(req.body.password, 8);
	}

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
