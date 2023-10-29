const stripe = require('stripe')(
	'sk_test_51NzTW3CbgJlRmRdkKfUeXSSjenBitlKjR5DIGFIQAbmScA02VKMWl4UiglydllkTBMT5EahsVJ25s7MsgWWhjt2p00k0FV66DV'
);

const Product = require('../models/Product');
const Order = require('../models/Order');
const { mailTransport, generateReceipt } = require('../utils/mail');

exports.pay = async (req, res) => {
	const items = req.body.products;
	let lineItems = [];
	// Add items from cart to line items
	items.forEach((item) => {
		lineItems.push({
			price_data: {
				currency: 'eur',
				unit_amount: item.price * 100,
				product_data: {
					name: item.title,
					images: [item.image[0]],
					metadata: {
						color: item.color,
						id: item._id,
					},
				},
			},
			quantity: item.quantity,
		});
	});

	try {
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
			// custom_fields: [
			// 	{
			// 		key: 'firstName',
			// 		label: {
			// 			type: 'custom',
			// 			custom: 'First name (Shipping info)',
			// 		},
			// 		type: 'text',
			// 	},
			// 	{
			// 		key: 'lastName',
			// 		label: {
			// 			type: 'custom',
			// 			custom: 'Last name (Shipping info)',
			// 		},
			// 		type: 'text',
			// 	},
			// ],
			success_url: `${process.env.CLIENT_URL}success`,
			cancel_url: `${process.env.CLIENT_URL}`,
		});

		return res.status(200).send({ url: session.url });
	} catch (error) {
		console.log(error);
	}
};

exports.stripeWebHook = async (req, res) => {
	let signSecret =
		'whsec_fb8426c3e46382d865f1a5a9a724b3177474d21682becc80090965e30da21efb';

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
		// case 'checkout.session.completed':
		// 	const sessionIntent = event.data.object;
		// 	let firstNameValue = sessionIntent.custom_fields[0].text.value;
		// 	let lastNameValue = sessionIntent.custom_fields[1].text.value;
		// 	break;
		case 'invoice.payment_succeeded':
			const paymentIntent = event.data.object;
			const invoiceItems = paymentIntent.lines.data;
			const customerEmail = paymentIntent.customer_email;
			const customerDeliveryInfo = {
				name: paymentIntent.customer_name,
				phone: paymentIntent.customer_phone,
				address: paymentIntent.customer_address,
			};
			const invoicePdf = paymentIntent.invoice_pdf;

			// Loop thru line items and remove their quantity from stock in db
			const invoiceProducts = [];
			for (var i = 0; i < invoiceItems.length; i++) {
				const product = await stripe.products.retrieve(
					invoiceItems[i].price.product
				);

				const productId = product.metadata.id;

				const productName = product.name;
				const productImage = product.images[0];
				const productColor = product.metadata.color;
				const productQuantity = invoiceItems[i].quantity;
				const productUnitAmount = invoiceItems[i].price.unit_amount / 100;
				const productTotalAmount = productUnitAmount * productQuantity;

				// Find products and add them to inoviceProducts array
				const invoiceProduct = {
					productName: productName,
					productImage: productImage,
					productColor: productColor,
					productQuantity: productQuantity,
					productUnitAmount: productUnitAmount,
					productTotalAmount: productTotalAmount,
				};
				invoiceProducts.push(invoiceProduct);
				// Find product in db then subtract its stock
				await Product.findByIdAndUpdate(
					{ _id: productId },
					{ $inc: { stock: -productQuantity } }
				);
			}

			// Create order in db
			const order = new Order({
				name: 'name',
				receiptLink: invoicePdf,
				products: invoiceProducts,
				amount: paymentIntent.amount_paid / 100,
				addressInfo: customerDeliveryInfo,
				status: 'Paid',
			});

			await order.save();

			// Create and send reciept to customer (Only for live mode not test mode until then send invoice using nodemailer)
			const mailOptions = {
				from: 'email@email.com',
				to: customerEmail,
				subject: 'Switchy - Order receipt',
				html: generateReceipt(),
				attachments: [
					{
						filename: 'receipt.pdf',
						path: invoicePdf,
					},
				],
			};
			mailTransport().sendMail(mailOptions, function (err, info) {
				if (err) {
					console.log(err);
				} else {
					res.json({ success: true, message: 'Email sent!' });
				}
			});

			// DELETE THIS AFTER TESTING
			// const paymentIntent = await stripe.paymentIntents.create({
			// 	amount: 1099,
			// 	currency: 'eur',
			// 	payment_method_types: ['card'],
			// 	description: 'Thanks for your purchase!',
			// 	receipt_email: 'pingo15102002@gmail.com',
			// });

			// const invoiceItem = await stripe.invoiceItems.retrieve(
			// 	paymentIntent.lines.data[0].invoice_item
			// );

			// console.log(invoiceItem);

			// const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
			// console.log(charge);
			// console.log(paymentIntent);
			console.log('Payment was successful!');
			break;
	}

	return res.status(200).send({ success: true });
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
