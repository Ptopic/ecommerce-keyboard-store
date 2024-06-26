const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const tokenHeader = req.headers.authorization.split(' ')[1];
	// const tokenHeader = req.headers.authorization.split(' ')[1];
	if (tokenHeader) {
		jwt.verify(tokenHeader, process.env.JWT_SECRET, (err, data) => {
			if (err) {
				return res
					.status(401)
					.send({ success: false, err: 'Token is not valid.' });
			}
			req.data = data;
			next();
		});
	} else {
		return res.status(401).send({ success: false, err: 'Token is missing.' });
	}
};

exports.verifyTokenAuthenticity = (req, res, next) => {
	const tokenHeader = req.headers.authorization.split(' ')[1];
	// console.log(req.headers.authorization.split(' ')[1]);
	console.log(req.headers.authorization);
	if (tokenHeader) {
		jwt.verify(tokenHeader, process.env.JWT_SECRET, (err, data) => {
			if (err) {
				return res
					.status(401)
					.send({ success: false, err: 'Token is not valid.' });
			}
			req.data = data;
			next();
		});
	} else {
		return res.status(401).send({ success: false, err: 'Token is missing.' });
	}
};

exports.verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.data.id === req.params.id || req.data.id === req.body.id) {
			next();
		} else {
			return res.status(403).send({
				success: false,
				err: 'You are not allowed to perform that action.',
			});
		}
	});
};

exports.verifyTokenAndAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.data.isAdmin) {
			next();
		} else {
			return res.status(403).send({
				success: false,
				err: 'You are not allowed to perform that action.',
			});
		}
	});
};
