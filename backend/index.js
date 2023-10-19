const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const productsRoute = require('./routes/products');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('db connected'))
	.catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/checkout', stripeRoute);

app.listen(process.env.PORT || 3001, () => {
	console.log('API is running');
});
