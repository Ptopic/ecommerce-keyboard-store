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

exports.searchProducts = async (req, res) => {
	const term = req.query.search;
	let termString = String(term);

	try {
		console.log(term);
		// Search for product that contains term in title
		let products = await Product.find({
			title: { $regex: termString, $options: 'i' },
		});
		return res.status(200).send({ success: true, data: products });
	} catch (err) {
		console.log(err);
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllProducts = async (req, res) => {
	const qsort = req.query.sort;
	const qCategory = req.query.category;
	const page = req.query.page;

	const minPrice = req.query.min;
	const maxPrice = req.query.max;
	const color = req.query.color;
	const material = req.query.material;
	try {
		let products;
		// Refactor this
		if (qCategory && qsort && (color || material) && minPrice && maxPrice) {
			if (color) {
				if (qsort === 'newest') {
					products = await Product.find({
						color: color,
						categories: qCategory,
						price: { $gte: minPrice, $lte: maxPrice },
					})
						.sort({ createdAt: -1 })
						.limit(10)
						.skip(10 * page);
				} else if (qsort === 'asc') {
					products = await Product.find({
						color: color,
						categories: qCategory,
						price: { $gte: minPrice, $lte: maxPrice },
					})
						.sort({ price: 1 })
						.limit(10)
						.skip(10 * page);
				} else {
					products = await Product.find({
						color: color,
						categories: qCategory,
						price: { $gte: minPrice, $lte: maxPrice },
					})
						.sort({ price: -1 })
						.limit(10)
						.skip(10 * page);
				}
			} else {
				if (qsort === 'newest') {
					products = await Product.find({
						material: material,
						categories: qCategory,
						price: { $gte: minPrice, $lte: maxPrice },
					})
						.sort({ createdAt: -1 })
						.limit(10)
						.skip(10 * page);
				} else if (qsort === 'asc') {
					products = await Product.find({
						material: material,
						categories: qCategory,
						price: { $gte: minPrice, $lte: maxPrice },
					})
						.sort({ price: 1 })
						.limit(10)
						.skip(10 * page);
				} else {
					products = await Product.find({
						material: material,
						categories: qCategory,
						price: { $gte: minPrice, $lte: maxPrice },
					})
						.sort({ price: -1 })
						.limit(10)
						.skip(10 * page);
				}
			}
		} else if (qCategory && qsort && minPrice && maxPrice) {
			if (qsort === 'newest') {
				products = await Product.find({
					categories: qCategory,
					price: { $gte: minPrice, $lte: maxPrice },
				})
					.sort({ createdAt: -1 })
					.limit(10)
					.skip(10 * page);
			} else if (qsort === 'asc') {
				products = await Product.find({
					categories: qCategory,
					price: { $gte: minPrice, $lte: maxPrice },
				})
					.sort({ price: 1 })
					.limit(10)
					.skip(10 * page);
			} else {
				products = await Product.find({
					categories: qCategory,
					price: { $gte: minPrice, $lte: maxPrice },
				})
					.sort({ price: -1 })
					.limit(10)
					.skip(10 * page);
			}
		} else if (qCategory && qsort && (color || material)) {
			if (color) {
				if (qsort === 'newest') {
					products = await Product.find({
						color: color,
						categories: qCategory,
					})
						.sort({ createdAt: -1 })
						.limit(10)
						.skip(10 * page);
				} else if (qsort === 'asc') {
					products = await Product.find({
						color: color,
						categories: qCategory,
					})
						.sort({ price: 1 })
						.limit(10)
						.skip(10 * page);
				} else {
					products = await Product.find({
						color: color,
						categories: qCategory,
					})
						.sort({ price: -1 })
						.limit(10)
						.skip(10 * page);
				}
			} else {
				if (qsort === 'newest') {
					products = await Product.find({
						material: material,
						categories: qCategory,
					})
						.sort({ createdAt: -1 })
						.limit(10)
						.skip(10 * page);
				} else if (qsort === 'asc') {
					products = await Product.find({
						material: material,
						categories: qCategory,
					})
						.sort({ price: 1 })
						.limit(10)
						.skip(10 * page);
				} else {
					products = await Product.find({
						material: material,
						categories: qCategory,
					})
						.sort({ price: -1 })
						.limit(10)
						.skip(10 * page);
				}
			}
		} else if (qsort && qCategory) {
			if (qsort === 'newest') {
				products = await Product.find({
					categories: qCategory,
				})
					.sort({ createdAt: -1 })
					.limit(10)
					.skip(10 * page);
			} else if (qsort === 'asc') {
				products = await Product.find({
					categories: qCategory,
				})
					.sort({ price: 1 })
					.limit(10)
					.skip(10 * page);
			} else {
				products = await Product.find({
					categories: qCategory,
				})
					.sort({ price: -1 })
					.limit(10)
					.skip(10 * page);
			}
		} else {
			products = await Product.find()
				.limit(10)
				.skip(10 * page);
		}
		return res.status(200).send({ success: true, data: products });
	} catch (err) {
		console.log(err);
		return res.status(500).send({ success: false, error: err });
	}
};
