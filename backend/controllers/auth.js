const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createRandomBytes } = require('../utils/helper');
const {
	mailTransport,
	generatePasswordResetTemplate,
} = require('../utils/mail');
const ResetToken = require('../models/ResetToken');
const schedule = require('node-schedule');

const deleteTokenJob = (id, time) => {
	let dateForJob = new Date();
	let hours = dateForJob.getHours();
	let minutes = dateForJob.getMinutes() + time;

	// If minutes + 10 is more than 60 increase hour by one and minute by 60 - that time

	if (minutes > 60) {
		let minutesDif = Math.abs(60 - minutes);
		hours = hours + 1;

		minutes = minutesDif;
	}
	let rule = new schedule.RecurrenceRule();
	rule.hour = hours;
	rule.minute = minutes;
	rule.seconds = 0;
	const job = schedule.scheduleJob(rule, async function () {
		// Delete auth token
		await ResetToken.findOneAndDelete({
			userId: id,
		});
	});
};

exports.forgotPassword = async (req, res) => {
	const { email } = req.body;

	// Check if email is provided
	if (!email) {
		return res.status(400).send({
			success: false,
			error: 'Please provide a email address',
		});
	}

	// Find user by email
	const user = await User.findOne({
		email: req.body.email,
	});
	if (!user) {
		return res.status(400).send({
			success: false,
			error: 'User not found.',
		});
	}

	// Create reset token
	const token = await createRandomBytes();

	// Save token to db
	try {
		const newToken = new ResetToken({
			userId: user._id,
			token: token,
		});
		const savedToken = await newToken.save();
	} catch (error) {
		console.log(error);
	}
	// Send password reset email

	const mailOptions = {
		from: 'email@email.com',
		to: user.email,
		subject: 'Forgot password',
		html: generatePasswordResetTemplate(
			user.username,
			process.env.CLIENT_URL + `reset-password?token=${token}&id=${user._id}`
		),
	};
	mailTransport().sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			res.json({ success: true, message: 'Email sent!' });
		}
	});

	// Delete token after 5 minutes
	deleteTokenJob(user._id, 5);
};

exports.verifyToken = async (req, res, next) => {
	const { tokenValue, id } = req.query;
	try {
		// Get token from db
		const foundToken = await ResetToken.findOne({
			token: tokenValue,
			userId: id,
		});
		if (!foundToken) {
			return res.status(400).send({ success: false, error: 'Token not found' });
		}
		next();
	} catch (error) {
		return res.status(500).send({ success: false, error: error });
	}
};

exports.resetPassword = async (req, res) => {
	// Change user password
	try {
		// Encrypt password
		let encryptedPassword = await bcrypt.hash(req.body.password, 8);

		await User.findByIdAndUpdate(
			{ _id: req.query.id },
			{ password: encryptedPassword },
			{ new: true }
		);

		// Delete auth token
		await ResetToken.findOneAndDelete({
			userId: req.query.id,
		});
		res.status(201).send({ success: true, message: 'Password changed.' });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.register = async (req, res) => {
	const newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		email: req.body.email,
		password: await bcrypt.hash(req.body.password, 8),
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

	if (
		!req.body.firstName ||
		!req.body.lastName ||
		!req.body.username ||
		!req.body.email ||
		!req.body.password
	) {
		return res
			.status(500)
			.send({ success: false, error: 'Some user information is missing!' });
	}

	// Generate access token (same when login so that user is automaticly logged in when registered)

	const accessToken = jwt.sign(
		{
			id: newUser._id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: '2d' }
	);

	try {
		const savedUser = await newUser.save();
		return res
			.status(201)
			.send({ success: true, data: savedUser, token: accessToken });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.login = async (req, res) => {
	try {
		console.log(req.body);
		const user = await User.findOne({ email: req.body.email });
		console.log(user);
		if (!user) {
			return res.status(401).send({ success: false, error: 'User not found.' });
		}

		console.log(user);

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
			{ expiresIn: '2d' }
		);
		const { password, ...otherInfo } = user._doc;

		return res
			.status(200)
			.send({ success: true, data: otherInfo, token: accessToken });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};
