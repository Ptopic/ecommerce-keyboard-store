const Order = require('../models/Order');

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

exports.getOrdersCount = async (search, year, month, day) => {
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

exports.getUserOrdersCount = async (search, userId, year, month, day) => {
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
	if (page && pageSize && sort && direction && search != '') {
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
	} else if (page && pageSize && search != '') {
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
			.skip(pageSize * page);
	} else if (sort && direction && search != '') {
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
			.skip(pageSize * page);
	} else if (sort && direction) {
		orders = await Order.find().sort([[sort, direction]]);
	} else {
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
	const newOrder = new Order(orderData);
	const savedOrder = await newOrder.save();
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
