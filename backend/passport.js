var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('./models/User');

require('dotenv').config();
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/api/auth/google/callback',
		},
		async function (accessToken, refreshToken, profile, cb) {
			console.log(profile);
			// CHeck if user exists
			const user = await User.findOne({ googleId: profile.id });
			if (user) {
				console.log('User already created' + user);
			} else {
				const newUser = new User({
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					googleId: profile.id,
					username: profile.displayName,
				});
				const savedUser = await newUser.save();
				console.log('Created new user' + savedUser);
			}
		}
	)
);
