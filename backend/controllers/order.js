const Order = require('../models/Order');

exports.getIncome = async (req, res) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	try {
		const income = await Order.aggregate([
			{ $match: { createdAt: { $gte: previousMonth } } },
			{
				$project: {
					month: { $month: '$createdAt' },
					sales: '$amount',
				},
			},
			{
				$group: {
					_id: '$month',
					total: { $sum: '$sales' },
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
	try {
		const order = await Order.find({ userId: req.params.userId });
		return res.status(200).send({ success: true, data: order });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find();
		return res.status(200).send({ success: true, data: orders });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};
