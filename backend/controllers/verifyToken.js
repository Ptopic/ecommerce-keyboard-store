const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const tokenHeader = req.headers.token;
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
		if (req.data.id === req.params.id || req.data.isAdmin) {
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
	console.log(req.params.id);
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
