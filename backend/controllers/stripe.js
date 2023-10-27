const stripe = require('stripe')(
	'sk_test_51NzTW3CbgJlRmRdkKfUeXSSjenBitlKjR5DIGFIQAbmScA02VKMWl4UiglydllkTBMT5EahsVJ25s7MsgWWhjt2p00k0FV66DV'
);

const Product = require('../models/Product');

exports.pay = async (req, res) => {
	const items = req.body.products;
	console.log(items);
	let lineItems = [];
	// Add items from cart to line items
	items.forEach((item) => {
		console.log(item);
		lineItems.push({
			price_data: {
				currency: 'eur',
				unit_amount: item.price * 100,
				product_data: {
					name: item.title,
					images: [item.image[0]],
					metadata: {
						color: item.color,
					},
				},
			},
			quantity: item.quantity,
		});
	});

	console.log(lineItems);

	const session = await stripe.checkout.sessions.create({
		phone_number_collection: {
			enabled: true,
		},
		shipping_address_collection: {
			allowed_countries: ['HR'],
		},
		line_items: lineItems,
		mode: 'payment',
		invoice_creation: {
			enabled: true,
		},
		success_url: `${process.env.CLIENT_URL}success`,
		cancel_url: `${process.env.CLIENT_URL}`,
	});

	console.log('succesfull payment');

	return res.status(200).send({ url: session.url });
};

exports.generateProducts = async (req, res, next) => {
	try {
		// Get all products
		const products = await Product.find();
		// Map thru products
		products.forEach(async (product) => {
			// Create product on stripe
			await stripe.products.create({
				id: product._id.valueOf(),
				name: product.title,
				images: [product.image],
			});
		});

		next();
	} catch (err) {
		return res.status(200).send({ success: false, error: err });
	}
};

exports.generateProductPrices = async (req, res) => {
	// Get all products
	const products = await Product.find();
	// Map thru products
	products.forEach(async (product) => {
		// Create price for product
		const price = await stripe.prices.create({
			unit_amount: product.price * 100,
			currency: 'eur',
			product: product._id.valueOf(),
		});
	});
	try {
		return res
			.status(200)
			.send({ success: true, data: 'Products created for stripe' });
	} catch (error) {
		return res.status(200).send({ success: false, error: err });
	}
};

exports.listAllProducts = async (req, res) => {
	try {
		const response = await stripe.products.list();
		const products = response.data;
		return res.status(200).send({ success: true, data: products });
	} catch (error) {
		return res.status(200).send({ success: false, error: error });
	}
};

exports.deleteAllProducts = async (req, res) => {
	try {
		const response = await stripe.products.list();
		const products = response.data;
		products.forEach(async (product) => {
			await stripe.products.del(product.id);
		});
		return res
			.status(200)
			.send({ success: true, data: 'All products deleted' });
	} catch (error) {
		return res.status(200).send({ success: false, error: error });
	}
};

// exports.pay = async (req, res) => {
// 	stripe.charges.create(
// 		{
// 			source: req.body.tokenId,
// 			amount: req.body.amount,
// 			currency: 'eur',
// 		},
// 		(stripeErr, stripeRes) => {
// 			if (stripeErr) {
// 				return res.status(500).send({ success: false, error: stripeErr });
// 			} else {
// 				return res.status(200).send({ success: true, data: stripeRes });
// 			}
// 		}
// 	);
// };
