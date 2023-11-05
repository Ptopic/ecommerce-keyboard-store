const stripe = require('stripe')(
	'sk_test_51NzTW3CbgJlRmRdkKfUeXSSjenBitlKjR5DIGFIQAbmScA02VKMWl4UiglydllkTBMT5EahsVJ25s7MsgWWhjt2p00k0FV66DV'
);

const Product = require('../models/Product');
const Order = require('../models/Order');
const { mailTransport, generateReceipt } = require('../utils/mail');

// Old stripe payment system using built in checkout component
// exports.pay = async (req, res) => {
// 	const items = req.body.products;
// 	let lineItems = [];
// 	// Add items from cart to line items
// 	items.forEach((item) => {
// 		lineItems.push({
// 			price_data: {
// 				currency: 'eur',
// 				unit_amount: item.price * 100,
// 				product_data: {
// 					name: item.title,
// 					images: [item.image[0]],
// 					metadata: {
// 						color: item.color,
// 						id: item._id,
// 					},
// 				},
// 			},
// 			quantity: item.quantity,
// 		});
// 	});

// 	try {
// 		const session = await stripe.checkout.sessions.create({
// 			phone_number_collection: {
// 				enabled: true,
// 			},
// 			shipping_address_collection: {
// 				allowed_countries: ['HR'],
// 			},
// 			line_items: lineItems,
// 			mode: 'payment',
// 			invoice_creation: {
// 				enabled: true,
// 			},
// 			// custom_fields: [
// 			// 	{
// 			// 		key: 'firstName',
// 			// 		label: {
// 			// 			type: 'custom',
// 			// 			custom: 'First name (Shipping info)',
// 			// 		},
// 			// 		type: 'text',
// 			// 	},
// 			// 	{
// 			// 		key: 'lastName',
// 			// 		label: {
// 			// 			type: 'custom',
// 			// 			custom: 'Last name (Shipping info)',
// 			// 		},
// 			// 		type: 'text',
// 			// 	},
// 			// ],
// 			success_url: `${process.env.CLIENT_URL}success`,
// 			cancel_url: `${process.env.CLIENT_URL}`,
// 		});

// 		return res.status(200).send({ url: session.url });
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

exports.stripe = async (req, res) => {
	const { amount, items } = req.body;

	try {
		// Create customer
		const customer = await stripe.customers.create();

		// Create invoice
		const invoice = await stripe.invoices.create({
			customer: customer.id,
		});

		// Create invoice items and link them to invoice by id
		for (var i = 0; i < items.length; i++) {
			console.log(items[i]);
			await stripe.invoiceItems.create({
				invoice: invoice.id,
				customer: customer.id,
				amount: items[i].quantity,
				currency: 'eur',
				metadata: {
					productId: items[i]._id,
					color: items[i].color,
					price: items[i].price,
				},
			});
		}

		const paymentIntent = await stripe.paymentIntents.create({
			// receipt_email: 'pingo15102002@gmail.com',
			amount,
			currency: 'eur',
			metadata: {
				invoice_id: invoice.id,
			},
		});

		return res
			.status(200)
			.send({ success: true, data: paymentIntent.client_secret });
	} catch (error) {
		console.log('error', error);
		return res.status(400).send({ success: false, error: error });
	}
};

exports.stripeWebHook = async (req, res) => {
	let signSecret = process.env.WEBHOOK_SECRET;

	console.log(signSecret);

	const payload = req.body;
	const sig = req.headers['stripe-signature'];
	let event;
	try {
		event = stripe.webhooks.constructEvent(payload, sig, signSecret);
	} catch (error) {
		console.log(error.message);
		return res.status(400).send({ success: false, error: error });
	}

	switch (event.type) {
		case 'charge.succeeded':
			const charge = event.data.object;

			const paymentIntent = await stripe.paymentIntents.retrieve(
				charge.payment_intent
			);

			console.log(paymentIntent);

			// Use this email to send receipt to user
			const customerEmail = charge.billing_details.email;

			// Get invoice from payment intent metadata
			const invoice = await stripe.invoices.retrieve(
				paymentIntent.metadata.invoice_id
			);

			const invoiceItems = invoice.lines.data;
			const name = charge.billing_details.name;
			const amount = charge.amount / 100;
			const billingInfo = charge.billing_details;
			const shippingInfo = charge.shipping;
			const recieptUrl = charge.receipt_url;
			// Save products from invoice items
			const products = [];
			for (var i = 0; i < invoiceItems.length; i++) {
				// Get product by productId
				const productFromDb = await Product.findById(
					invoiceItems[i].metadata.productId
				);
				const product = {
					productId: invoiceItems[i].metadata.productId,
					color: invoiceItems[i].metadata.color,
					price: invoiceItems[i].metadata.price,
					quantity: invoiceItems[i].amount,
					originalProduct: productFromDb,
				};
				products.push(product);

				// Decrement product stock
				await Product.findByIdAndUpdate(
					{ _id: invoiceItems[i].metadata.productId },
					{ $inc: { stock: -invoiceItems[i].amount } }
				);
			}

			var orderNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

			// Create order in db
			const order = new Order({
				_id: orderNumber,
				name: name,
				receiptLink: recieptUrl,
				products: products,
				amount: amount,
				shippingInfo: shippingInfo,
				billingInfo: billingInfo,
				status: 'Paid',
			});

			await order.save();

			// Create and send reciept to customer (Only for live mode not test mode until then send invoice using nodemailer)
			const mailOptions = {
				from: 'email@email.com',
				to: customerEmail,
				subject: 'Switchy - Order receipt',
				html: generateReceipt(recieptUrl, order._id, amount, products),
			};
			mailTransport().sendMail(mailOptions, function (err, info) {
				if (err) {
					console.log(err);
				} else {
					res.json({ success: true, message: 'Email sent!' });
				}
			});
			console.log('Payment was successful!');
			break;
	}

	return res.status(200).send({ success: true });
};

exports.sendTestEmail = async (req, res) => {
	const mailOptions = {
		from: 'email@email.com',
		to: 'pingo15102002@gmail.com',
		subject: 'Switchy - Order receipt',
		html: generateReceipt('test'),
	};
	mailTransport().sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			res.json({ success: true, message: 'Email sent!' });
		}
	});
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
