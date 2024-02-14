const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const upload = require('../middleware/upload');
const cloudinary = require('cloudinary').v2;

//Imporing file system library
const fs = require('fs');
const { uploadToCloudinary, removeFromCloudinary } = require('./cloudinary');

exports.createProduct = async (req, res) => {
	const { title, description, images, category, price, stock, activeFields } =
		req.body;

	try {
		if (images) {
			// Map active fields to details object
			let details = {};

			for (let field of activeFields) {
				details[field] = String(req.body[field]).toLowerCase();
			}

			let imagesArray = [];
			for (let image of images) {
				const uploadRes = await uploadToCloudinary(image, 'shop');

				imagesArray.push(uploadRes);
			}
			const newProduct = new Product({
				title: title,
				description: description,
				images: imagesArray,
				category: category,
				details: details,
				price: price,
				stock: stock,
			});

			const savedProduct = await newProduct.save();
			return res.status(200).send({ success: true, data: savedProduct });
		} else {
			// Map active fields to details object
			let details = {};

			for (let field of activeFields) {
				details[field] = req.body[field];
			}

			const newProduct = new Product({
				title: title,
				description: description,
				images: [],
				category: category,
				details: details,
				price: price,
				stock: stock,
			});

			const savedProduct = await newProduct.save();
			return res.status(200).send({ success: true, data: savedProduct });
		}
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.updateProduct = async (req, res) => {
	const { colors, sizes, materials, names } = req.body;
	try {
		let updatedProduct;
		if (colors || sizes || materials) {
			// Loop thru names array and join it with -
			let combinationNamesArray = [];
			for (let name of names) {
				let nameValue = name.length == 1 ? name : name.join('-');
				combinationNamesArray.push(nameValue);
			}
			updatedProduct = await Product.findByIdAndUpdate(
				req.params.id,
				{
					$set: {
						...req.body,
						colors: colors,
						sizes: sizes,
						materials: materials,
						variationNames: combinationNamesArray,
					},
				},
				{ new: true }
			);
		} else {
			updatedProduct = await Product.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true }
			);
		}

		return res.status(200).send({ success: true, data: updatedProduct });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteProduct = async (req, res) => {
	const { id } = req.params;

	// Get product
	const productFromDb = await Product.findById(id);
	const productImages = productFromDb.images;

	try {
		// Delete image from cloudinary
		for (let image of productImages) {
			await removeFromCloudinary(image.public_id);
		}

		await Product.findByIdAndDelete(id);
		return res
			.status(200)
			.send({ success: true, data: 'Product has been deleted' });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getProduct = async (req, res) => {
	const { id } = req.params;

	try {
		const product = await Product.findById(id);
		return res.status(200).send({ success: true, data: product });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.searchProducts = async (req, res) => {
	const term = req.query.search;
	let termString = String(term);

	try {
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
	const { sort, direction, page, pageSize, search } = req.query;

	// Get total number of orders
	let totalProducts;
	// If search query is not empty, get total number of orders that match search query
	if (search != '' && search != null) {
		totalProducts = await Product.find({
			name: { $regex: search, $options: 'i' },
		}).count();
	} else {
		totalProducts = await Product.find().count();
	}

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalProducts / pageSize);

	try {
		let products;
		if (page && pageSize && sort && direction && search != '') {
			products = await Product.find({
				name: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize && search != '') {
			products = await Product.find({
				name: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort && direction && search != '') {
			products = await Product.find({
				name: { $regex: search, $options: 'i' },
			}).sort([[sort, direction]]);
		} else if (page && pageSize && sort && direction) {
			products = await Product.find()
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize) {
			products = await Product.find()
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort && direction) {
			products = await Product.find().sort([[sort, direction]]);
		} else {
			products = await Product.find();
		}
		return res.status(200).send({
			success: true,
			data: products,
			totalProducts: totalProducts,
			totalPages: totalPages,
		});
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

// -------------------- Product variants --------------------

exports.getAllProductVariations = async (req, res) => {
	const { id } = req.params;
	try {
		const productVariations = await ProductVariation.find({ productId: id });

		return res.status(200).send({
			success: true,
			data: productVariations,
		});
	} catch (error) {
		return res.status(500).send({ success: false, error: error });
	}
};

exports.createOrUpdateProductVariants = async (req, res) => {
	const { variations, productId, names } = req.body;

	try {
		// Delete all previous variations because of state change
		await ProductVariation.deleteMany({ productId: productId });

		for (let i = 0; i < variations.length; i++) {
			let nameValue = names[i].length == 1 ? names[i] : names[i].join('-');
			const result = await ProductVariation.findOneAndUpdate(
				{ productId: productId, name: nameValue },
				{
					$set: {
						productId: productId,
						price: variations[i].price,
						stock: variations[i].price,
						images: variations[i].images,
						name: nameValue,
					},
				},
				{ upsert: true, new: true }
			);
		}
	} catch (error) {
		return res.status(500).send({ success: false, error: error });
	}

	return res.status(200).send({
		success: true,
		data: 'Product variations created.',
	});
};
