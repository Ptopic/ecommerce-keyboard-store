const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const passportSetup = require('./passport');

// Routes
const { stripeWebHook } = require('./controllers/stripe');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const productsRoute = require('./routes/products');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');
const wishlistRoute = require('./routes/wishlist');

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('db connected'))
	.catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: '*/*' }));
app.use(bodyParser.json());
app.use(cors());
app.use(
	session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.post(
	'/api/checkout/webhook',
	express.raw({ type: 'application/json' }),
	stripeWebHook
);
app.use(express.json());
app.use('/api/checkout', stripeRoute);

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/', wishlistRoute);

app.listen(process.env.PORT || 3001, () => {
	console.log('API is running');
});
