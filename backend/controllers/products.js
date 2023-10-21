const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
	const newProduct = new Product(req.body);

	try {
		const savedProduct = await newProduct.save();
		return res.status(200).send({ success: true, data: savedProduct });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		return res.status(200).send({ success: true, data: updatedProduct });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);
		return res
			.status(200)
			.send({ success: true, data: 'Product has been deleted' });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		return res.status(200).send({ success: true, data: product });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllProducts = async (req, res) => {
	const qNew = req.query.new;
	const qCategory = req.query.category;
	const page = req.query.page;
	try {
		let products;
		if (qNew) {
			products = await Product.find()
				.limit(10)
				.skip(10 * page)
				.sort({ createAt: -1 });
		} else if (qCategory) {
			products = await Product.find({
				categories: {
					$in: [qCategory],
				},
			})
				.limit(10)
				.skip(10 * page);
		} else {
			products = await Product.find()
				.limit(10)
				.skip(10 * page);
		}
		return res.status(200).send({ success: true, data: products });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};
