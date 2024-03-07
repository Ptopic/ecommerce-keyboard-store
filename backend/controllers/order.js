const Order = require('../models/Order');
const {
	getOrdersCount,
	getIncome,
	createOrder,
	editOrder,
	deleteOrderById,
	getUserOrders,
	getUserOrdersCount,
	getOrders,
	splitSearchDate,
	getTotalOrders,
	getUserTotalOrders,
} = require('../services/order');

exports.getOrdersCount = async (req, res) => {
	try {
		const ordersCount = await getOrdersCount();
		return res.status(200).send({ success: true, data: ordersCount });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getIncome = async (req, res) => {
	try {
		const income = await getIncome();

		return res.status(200).send({ success: true, data: income });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.createOrder = async (req, res) => {
	try {
		const savedOrder = await createOrder(req.body);
		return res.status(200).send({ success: true, data: savedOrder });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.editOrder = async (req, res) => {
	const { id } = req.params;
	try {
		const updatedOrder = await editOrder(id, req.body);
		return res.status(200).send({ success: true, data: updatedOrder });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteOrder = async (req, res) => {
	const { id } = req.params;
	try {
		await deleteOrderById(id);
		return res
			.status(200)
			.send({ success: true, data: 'Order has been deleted' });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getUserOrders = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;
	const { userId } = req.params;

	let year = 0;
	let month = 0;
	let day = 0;

	if (search) {
		let splittedDate = splitSearchDate(search);

		year = splittedDate[2];
		month = splittedDate[1];
		day = splittedDate[0];
	}

	// Get total number of orders
	let totalOrders = await getUserTotalOrders(search, userId, year, month, day);

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalOrders / pageSize);

	try {
		let orders = await getUserOrders(
			page,
			pageSize,
			sort,
			direction,
			search,
			userId,
			year,
			month,
			day
		);

		return res.status(200).send({
			success: true,
			data: orders,
			totalOrders: totalOrders,
			totalPages: totalPages,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllOrders = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;

	// If search query is not empty, get total number of orders that match search query
	let year = 0;
	let month = 0;
	let day = 0;

	if (search) {
		let splittedDate = splitSearchDate(search);

		year = splittedDate[2];
		month = splittedDate[1];
		day = splittedDate[0];
	}

	// Get total number of orders
	let totalOrders = await getTotalOrders(search, year, month, day);

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalOrders / pageSize);

	try {
		let orders = await getOrders(
			page,
			pageSize,
			sort,
			direction,
			search,
			year,
			month,
			day
		);
		return res.status(200).send({
			success: true,
			data: orders,
			totalOrders: totalOrders,
			totalPages: totalPages,
		});
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getOrderByOrderId = async (req, res) => {
	const { orderId } = req.query;
	try {
		const order = await Order.find({ _id: orderId });
		return res.status(200).send({ success: true, data: order });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};
