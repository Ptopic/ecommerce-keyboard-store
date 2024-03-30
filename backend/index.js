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
const categoriesRoute = require('./routes/categories');
const productsRoute = require('./routes/products');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');
const wishlistRoute = require('./routes/wishlist');
const filtersRoute = require('./routes/filters');

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('db connected'))
	.catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.post('/api/checkout/webhook', express.raw({ type: '*/*' }), stripeWebHook);
app.use(
	session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use('/api/checkout', stripeRoute);

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/', wishlistRoute);
app.use('/api/filters', filtersRoute);

app.listen(process.env.PORT || 3001, () => {
	console.log('API is running');
});
