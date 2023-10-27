const router = require('express').Router();
const passport = require('passport');
const {
	register,
	login,
	forgotPassword,
	resetPassword,
	verifyToken,
} = require('../controllers/auth');
require('dotenv').config();

const url = process.env.CLIENT_URL;

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', verifyToken, resetPassword);
router.get('/verify-token', verifyToken);
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/logout', (req, res) => {
	req.logout();
});

router.get('/login/success', (req, res) => {
	if (req.user) {
		res.status(200).send({ success: true, data: req.user });
	}
});

router.get('/login/failed', (req, res) => {
	res.status(401).send({ success: false, error: 'User not found.' });
});

// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
// 	res.send(req.user);
// });

router.get(
	'/google/callback',
	passport.authenticate(
		'google',
		{
			successRedirect: 'http://192.168.1.200/',
			failureRedirect: 'http://192.168.1.200/login',
		},
		(req, res) => {}
	)
);

module.exports = router;
