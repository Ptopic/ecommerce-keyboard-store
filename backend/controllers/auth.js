const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createRandomBytes } = require('../utils/helper');
const {
	mailTransport,
	generatePasswordResetTemplate,
} = require('../utils/mail');

const {
	deleteTokenJob,
	createResetToken,
	getResetToken,
	deleteResetTokenByUserId,
	generateJwt,
} = require('../services/auth');

const {
	getUserByEmail,
	getUserByUsername,
	changeUserPassword,
} = require('../services/users');

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
	let user = await getUserByEmail(email);

	if (!user) {
		return res.status(400).send({
			success: false,
			error: 'User not found.',
		});
	}

	const token = await createRandomBytes(); // Create reset token

	try {
		await createResetToken(user._id, token); // Save token to db
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

	deleteTokenJob(user._id, 5); // Delete token after 5 minutes
};

exports.verifyToken = async (req, res, next) => {
	const { tokenValue, id } = req.query;
	try {
		const foundToken = await getResetToken(tokenValue, id); // Get token from db
		if (!foundToken) {
			return res.status(400).send({ success: false, error: 'Token not found' });
		}
		next();
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.resetPassword = async (req, res) => {
	const { id } = req.query;
	try {
		let encryptedPassword = await bcrypt.hash(req.body.password, 8); // Encrypt password

		await changeUserPassword(id, encryptedPassword); // Change user password

		await deleteResetTokenByUserId(id); // Delete auth token

		res.status(201).send({ success: true, message: 'Password changed.' });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.register = async (req, res) => {
	const { firstName, lastName, username, email, password } = req.body;

	if (!firstName || !lastName || !username || !email || !password) {
		return res
			.status(500)
			.send({ success: false, error: 'Some user information is missing!' });
	}

	const newUser = new User({
		firstName: firstName,
		lastName: lastName,
		username: username,
		email: email,
		password: await bcrypt.hash(password, 8),
	});

	const checkUsername = await getUserByUsername(username);

	// Check if user with that username existst
	if (checkUsername)
		return res.status(400).send({
			success: false,
			error: 'User with that username already exists.',
		});

	const checkEmail = await getUserByEmail(email);

	// Check if user with that email exists
	if (checkEmail)
		return res.status(400).send({
			success: false,
			error: 'User with that email already exists.',
		});

	const accessToken = await generateJwt(newUser._id); // Generate jwt token

	try {
		const savedUser = await newUser.save();
		return res
			.status(201)
			.send({ success: true, data: savedUser, token: accessToken });
	} catch (error) {
		return res.status(500).send({ success: false, error: error });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await getUserByEmail(email);

		if (!user) {
			return res.status(401).send({ success: false, error: 'User not found.' });
		}

		const isPasswordCorrect = bcrypt.compareSync(
			// Compare user password and given password
			req.body.password,
			user.password
		);

		if (!isPasswordCorrect) {
			return res.status(401).send({ success: false, error: 'Wrong password.' });
		}

		const accessToken = await generateJwt(user._id, user.isAdmin); // Generate jwt token

		const { password, ...otherInfo } = user._doc; // Hide password in response

		return res
			.status(200)
			.send({ success: true, data: otherInfo, token: accessToken });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: err });
	}
};
