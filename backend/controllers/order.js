const Order = require('../models/Order');

exports.getOrdersCount = async (req, res) => {
	try {
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
		return res.status(200).send({ success: true, data: ordersCount });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getIncome = async (req, res) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	try {
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

		return res.status(200).send({ success: true, data: income });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.createOrder = async (req, res) => {
	const newOrder = new Order(req.body);

	try {
		const savedOrder = await newOrder.save();
		return res.status(200).send({ success: true, data: savedOrder });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.editOrder = async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		return res.status(200).send({ success: true, data: updatedOrder });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteOrder = async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);
		return res
			.status(200)
			.send({ success: true, data: 'Order has been deleted' });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getUserOrder = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;

	// Get total number of orders
	let totalOrders;
	// If search query is not empty, get total number of orders that match search query
	if (search != '' && search != null) {
		totalOrders = await Order.find({
			userId: req.params.userId,
			orderNumber: { $regex: search, $options: 'i' },
		}).count();
	} else {
		totalOrders = await Order.find({ userId: req.params.userId }).count();
	}

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalOrders / pageSize);

	try {
		let order;
		if (page && pageSize && sort && direction && search != '') {
			order = await Order.find({
				userId: req.params.userId,
				orderNumber: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize && search != '') {
			order = await Order.find({
				userId: req.params.userId,
				orderNumber: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort && direction && search != '') {
			order = await Order.find({
				userId: req.params.userId,
				orderNumber: { $regex: search, $options: 'i' },
			}).sort([[sort, direction]]);
		} else if (page && pageSize && sort && direction) {
			order = await Order.find({ userId: req.params.userId })
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize) {
			order = await Order.find({ userId: req.params.userId })
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort && direction) {
			order = await Order.find({ userId: req.params.userId }).sort([
				[sort, direction],
			]);
		} else {
			order = await Order.find({ userId: req.params.userId });
		}
		return res.status(200).send({
			success: true,
			data: order,
			totalOrders: totalOrders,
			totalPages: totalPages,
		});
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllOrders = async (req, res) => {
	const sort = req.query.sort;
	const page = req.query.page;
	const pageSize = req.query.pageSize;

	try {
		let orders;
		if (page && pageSize) {
			orders = await Order.find()
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([['createdAt', -1]]);
		} else if (page) {
			orders = await Order.find()
				.limit(10)
				.skip(10 * page)
				.sort([['createdAt', -1]]);
		} else {
			orders = await Order.find().sort([['createdAt', -1]]);
		}
		return res.status(200).send({ success: true, data: orders });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getOrderByOrderId = async (req, res) => {
	try {
		console.log(req.query.orderId);
		const order = await Order.find({ _id: req.query.orderId });
		return res.status(200).send({ success: true, data: order });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};
