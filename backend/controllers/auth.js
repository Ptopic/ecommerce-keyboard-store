const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: await bcrypt.hash(req.body.password, 8),
	});

	if (!req.body.username || !req.body.email || !req.body.password) {
		return res
			.status(500)
			.send({ success: false, error: 'Some user information is missing!' });
	}

	try {
		const savedUser = await newUser.save();
		return res.status(201).send({ success: true, data: savedUser });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.login = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			return res.status(401).send({ success: false, error: 'User not found.' });
		}

		const isPasswordCorrect = bcrypt.compareSync(
			req.body.password,
			user.password
		);

		if (!isPasswordCorrect) {
			return res.status(401).send({ success: false, error: 'Wrong password.' });
		}

		const accessToken = jwt.sign(
			{
				id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '3d' }
		);
		const { password, ...otherInfo } = user._doc;

		return res
			.status(200)
			.send({ success: true, data: otherInfo, token: accessToken });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};
