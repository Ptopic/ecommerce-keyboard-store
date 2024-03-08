const Order = require('../models/Order');
const { mailTransport, generateReceiptAdmin } = require('../utils/mail');

exports.splitSearchDate = (search) => {
	let splittedDate = search ? search.split('.') : null;
	if (splittedDate && splittedDate.length == 3) {
		if (splittedDate[0].length == 1) {
			splittedDate[0] = '0' + splittedDate[0];
		} else if (splittedDate[1].length == 1) {
			splittedDate[1] = '0' + splittedDate[1];
		}
	}
	return splittedDate;
};

exports.getOrdersCount = async () => {
	const ordersCount = await Order.aggregate([
		{
			$group: {
				_id: {
					month: { $month: '$createdAt' },
					year: { $year: '$createdAt' },
				},
				ordersCount: { $sum: 1 },
			},
		},
	]);
	return ordersCount;
};

exports.getIncome = async () => {
	const income = await Order.aggregate([
		{
			$group: {
				_id: {
					month: { $month: '$createdAt' },
					year: { $year: '$createdAt' },
				},
				totalSales: { $sum: '$amount' },
			},
		},
	]);
	return income;
};

exports.getTotalOrders = async (search, year, month, day) => {
	let totalOrders;
	if (search != '' && search != null) {
		totalOrders = await Order.find({
			$or: [
				{ orderNumber: { $regex: search, $options: 'i' } },
				{
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, year] },
							{ $eq: [{ $month: '$createdAt' }, month] },
							{ $eq: [{ $dayOfMonth: '$createdAt' }, day] },
						],
					},
				},
			],
		}).count();
	} else {
		totalOrders = await Order.find().count();
	}
	return totalOrders;
};

exports.getUserTotalOrders = async (search, userId, year, month, day) => {
	let totalOrders;
	if (search != '' && search != null) {
		totalOrders = await Order.find({
			userId: userId,
			$or: [
				{ orderNumber: { $regex: search, $options: 'i' } },
				{
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, year] },
							{ $eq: [{ $month: '$createdAt' }, month] },
							{ $eq: [{ $dayOfMonth: '$createdAt' }, day] },
						],
					},
				},
			],
		}).count();
	} else {
		totalOrders = await Order.find({ userId: userId }).count();
	}
	return totalOrders;
};

exports.getOrders = async (
	page,
	pageSize,
	sort,
	direction,
	search,
	year,
	month,
	day
) => {
	let orders;
	if (page && pageSize && sort && direction && search && search != '') {
		orders = await Order.find({
			$or: [
				{ orderNumber: { $regex: search, $options: 'i' } },
				{
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, year] },
							{ $eq: [{ $month: '$createdAt' }, month] },
							{ $eq: [{ $dayOfMonth: '$createdAt' }, day] },
						],
					},
				},
			],
		})
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([[sort, direction]]);
	} else if (page && pageSize && search && search != '') {
		orders = await Order.find({
			$or: [
				{ orderNumber: { $regex: search, $options: 'i' } },
				{
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, year] },
							{ $eq: [{ $month: '$createdAt' }, month] },
							{ $eq: [{ $dayOfMonth: '$createdAt' }, day] },
						],
					},
				},
			],
		})
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([['createdAt', -1]]);
	} else if (sort && direction && search && search != '') {
		orders = await Order.find({
			$or: [
				{ orderNumber: { $regex: search, $options: 'i' } },
				{
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, year] },
							{ $eq: [{ $month: '$createdAt' }, month] },
							{ $eq: [{ $dayOfMonth: '$createdAt' }, day] },
						],
					},
				},
			],
		}).sort([[sort, direction]]);
	} else if (page && pageSize && sort && direction) {
		orders = await Order.find()
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([[sort, direction]]);
	} else if (page && pageSize) {
		orders = await Order.find()
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([['createdAt', -1]]);
	} else if (sort && direction) {
		orders = await Order.find().sort([[sort, direction]]);
	} else {
		console.log('test');
		orders = await Order.find().sort([['createdAt', -1]]);
	}
	return orders;
};

exports.getUserOrders = async (
	page,
	pageSize,
	sort,
	direction,
	search,
	userId,
	year,
	month,
	day
) => {
	let orders;
	if (page && pageSize && sort && direction && search != '') {
		orders = await Order.find({
			userId: userId,
			$or: [
				{ orderNumber: { $regex: search, $options: 'i' } },
				{
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, year] },
							{ $eq: [{ $month: '$createdAt' }, month] },
							{ $eq: [{ $dayOfMonth: '$createdAt' }, day] },
						],
					},
				},
			],
		})
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([[sort, direction]]);
	} else if (page && pageSize && search != '') {
		orders = await Order.find({
			userId: userId,
			$or: [
				{ orderNumber: { $regex: search, $options: 'i' } },
				{
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, year] },
							{ $eq: [{ $month: '$createdAt' }, month] },
							{ $eq: [{ $dayOfMonth: '$createdAt' }, day] },
						],
					},
				},
			],
		})
			.limit(pageSize)
			.skip(pageSize * page);
	} else if (sort && direction && search != '') {
		orders = await Order.find({
			userId: userId,
			$or: [
				{ orderNumber: { $regex: search, $options: 'i' } },
				{
					$expr: {
						$and: [
							{ $eq: [{ $year: '$createdAt' }, year] },
							{ $eq: [{ $month: '$createdAt' }, month] },
							{ $eq: [{ $dayOfMonth: '$createdAt' }, day] },
						],
					},
				},
			],
		}).sort([[sort, direction]]);
	} else if (page && pageSize && sort && direction) {
		orders = await Order.find({ userId: userId })
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([[sort, direction]]);
	} else if (page && pageSize) {
		orders = await Order.find({ userId: userId })
			.limit(pageSize)
			.skip(pageSize * page);
	} else if (sort && direction) {
		orders = await Order.find({ userId: userId }).sort([[sort, direction]]);
	} else {
		orders = await Order.find({ userId: userId });
	}
	return orders;
};

exports.createOrder = async (orderData) => {
	const {
		email,
		firstName,
		lastName,
		tvrtka,
		tvrtkaDostava,
		oib,
		products,
		amount,
		billingDetails,
		shippingDetails,
	} = orderData;

	var orderNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

	const newOrder = new Order({
		name: firstName + ' ' + lastName,
		receiptLink: '',
		products: products,
		amount: amount,
		shippingInfo: shippingDetails,
		billingInfo: billingDetails,
		status: 'Pending',
		orderNumber: orderNumber,
		tvrtka: tvrtka,
		tvrtkaDostava: tvrtkaDostava,
		oib: oib,
	});
	const savedOrder = await newOrder.save();

	// Create and send reciept to customer (Only for live mode not test mode until then send invoice using nodemailer)
	const mailOptions = {
		from: 'email@email.com',
		to: email,
		subject: 'Switchy - Order receipt',
		html: generateReceiptAdmin(
			'',
			savedOrder._id,
			orderNumber,
			amount,
			products
		),
	};
	mailTransport().sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			res.json({ success: true, message: 'Email sent!' });
		}
	});
	return savedOrder;
};

exports.editOrder = async (id, orderData) => {
	const editedOrder = await Order.findByIdAndUpdate(
		id,
		{
			$set: orderData,
		},
		{ new: true }
	);
	return editedOrder;
};

exports.deleteOrderById = async (id) => {
	await Order.findByIdAndDelete(id);
};
