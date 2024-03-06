const schedule = require('node-schedule');
const jwt = require('jsonwebtoken');

// Models
const ResetToken = require('../models/ResetToken');

exports.deleteTokenJob = (id, time) => {
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

exports.createResetToken = async (userId, token) => {
	const newToken = new ResetToken({
		userId: userId,
		token: token,
	});
	await newToken.save();
};

exports.getResetToken = async (tokenValue, id) => {
	const resetToken = await ResetToken.findOne({
		token: tokenValue,
		userId: id,
	});

	return resetToken;
};

exports.deleteResetTokenByUserId = async (id) => {
	await ResetToken.findOneAndDelete({
		userId: id,
	});
};

exports.generateJwt = async (newUserId, isAdmin) => {
	const generatedToken = jwt.sign(
		{
			id: newUserId ? newUserId : null,
			isAdmin: isAdmin ? isAdmin : null,
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN }
	);
	return generatedToken;
};
