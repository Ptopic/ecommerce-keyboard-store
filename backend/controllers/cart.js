const Cart = require('../models/Cart');

exports.createCart = async (req, res) => {
	const newCart = new Cart(req.body);

	try {
		const savedCart = await newCart.save();
		return res.status(200).send({ success: true, data: savedCart });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.editCart = async (req, res) => {
	try {
		const updatedCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		return res.status(200).send({ success: true, data: updatedCart });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteCart = async (req, res) => {
	try {
		await Cart.findByIdAndDelete(req.params.id);
		return res
			.status(200)
			.send({ success: true, data: 'Cart has been deleted' });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getUserCart = async (req, res) => {
	try {
		const cart = await Cart.findOne({ userId: req.params.userId });
		return res.status(200).send({ success: true, data: cart });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllCarts = async (req, res) => {
	try {
		const carts = await Cart.find();
		return res.status(200).send({ success: true, data: carts });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};
