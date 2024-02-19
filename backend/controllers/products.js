const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');

const { uploadToCloudinary, removeFromCloudinary } = require('./cloudinary');

exports.createProduct = async (req, res) => {
	let {
		title,
		specifications,
		description,
		images,
		category,
		price,
		stock,
		activeFields,
	} = req.body;

	price = parseFloat(price).toFixed(2);

	try {
		if (images) {
			// Map active fields to details object
			let details = {};

			for (let field of activeFields) {
				// details[field] = String(req.body[field]).toLowerCase().trim();
				details[field] = String(req.body[field]);
			}

			let imagesArray = [];
			for (let image of images) {
				const uploadRes = await uploadToCloudinary(image, 'shop');

				imagesArray.push(uploadRes);
			}

			const newProduct = new Product({
				title: title,
				specifications: specifications,
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
	let {
		title,
		specifications,
		description,
		images,
		category,
		price,
		stock,
		activeFields,
	} = req.body;

	price = parseFloat(price).toFixed(2);

	console.log(req.params.id);

	try {
		if (images) {
			// Map active fields to details object
			let details = {};

			for (let field of activeFields) {
				// details[field] = String(req.body[field]).toLowerCase().trim();
				details[field] = String(req.body[field]);
			}

			let imagesArray = [];
			for (let image of images) {
				const uploadRes = await uploadToCloudinary(image, 'shop');

				imagesArray.push(uploadRes);
			}

			let updatedProduct = await Product.findByIdAndUpdate(
				req.params.id,
				{
					$set: {
						title: title,
						specifications: specifications,
						description: description,
						category: category,
						details: details,
						price: price,
						stock: stock,
					},
					$push: {
						images: { $each: imagesArray },
					},
				},
				{ new: true }
			);
			return res.status(200).send({ success: true, data: updatedProduct });
		} else {
			// Map active fields to details object
			let details = {};

			for (let field of activeFields) {
				details[field] = req.body[field];
			}

			let updatedProduct = await Product.findByIdAndUpdate(
				req.params.id,
				{
					$set: {
						title: title,
						specifications: specifications,
						description: description,
						category: category,
						details: details,
						price: price,
						stock: stock,
					},
				},
				{ new: true }
			);
			return res.status(200).send({ success: true, data: updatedProduct });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteProductImage = async (req, res) => {
	const { productImageId } = req.body;
	const { id } = req.params;

	try {
		// Get product
		const productFromDb = await Product.findById(id);

		if (!productFromDb) {
			return res
				.status(404)
				.send({ success: false, error: 'Product not found' });
		}

		const productImages = productFromDb.images;

		let imageToDelete = productImages[productImageId];

		await removeFromCloudinary(imageToDelete.public_id);

		// Pull element from images array by public id
		await Product.updateOne(
			{ _id: id },
			{ $pull: { images: { public_id: imageToDelete.public_id } } }
		);

		return res
			.status(200)
			.send({ success: true, data: 'Product image removed' });
	} catch (error) {
		return res.status(500).send({ success: true, error: error });
	}
};

exports.deleteProduct = async (req, res) => {
	const { id } = req.params;

	// Get product
	const productFromDb = await Product.findById(id);

	if (!productFromDb) {
		return res.status(404).send({ success: false, error: 'Product not found' });
	}

	const productImages = productFromDb.images;

	// Remove product variation images from cloudinary
	const productVariations = await ProductVariation.find({ productId: id });

	for (let produtVariation of productVariations) {
		if (produtVariation.images.length > 0) {
			for (let image of productImages) {
				await removeFromCloudinary(image.public_id);
			}
		}
	}

	// Delete all previous variations of product
	for (let variation of productVariations) {
		await variation.deleteOne();
	}

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
	let { sort, direction, page, pageSize, minPrice, maxPrice } = req.query;

	const term = req.query.search;
	let termString = String(term);

	// If sort and direction is null use default
	if (sort == null && direction == null) {
		(sort = 'createdAt'), (direction = 'desc');
	}

	console.log(req.query);

	// Get total number of products
	let totalProducts;
	if (minPrice && maxPrice) {
		totalProducts = await Product.find({
			price: { $gte: minPrice, $lte: maxPrice },
		}).count();
	} else {
		totalProducts = await Product.find().count();
	}

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalProducts / pageSize);

	try {
		let products;

		// Sortiraj prema najnovijima po defaultu
		products = await Product.find({
			price: { $gte: minPrice, $lte: maxPrice },
		})
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([[sort, direction]]);

		return res.status(200).send({
			success: true,
			data: products,
			totalProducts: totalProducts,
			totalPages: totalPages,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllProductsByCategory = async (req, res) => {
	let { category } = req.params;
	let { sort, direction, page, pageSize, minPrice, maxPrice } = req.query;

	// If sort and direction is null use default
	if (sort == null && direction == null) {
		(sort = 'createdAt'), (direction = 'desc');
	}

	console.log(req.query);

	// Get total number of products
	let totalProducts;
	if (minPrice && maxPrice) {
		totalProducts = await Product.find({
			price: { $gte: minPrice, $lte: maxPrice },
			category: category,
		}).count();
	} else {
		totalProducts = await Product.find({ category: category }).count();
	}

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalProducts / pageSize);

	try {
		let products;

		// Sortiraj prema najnovijima po defaultu
		products = await Product.find({
			price: { $gte: minPrice, $lte: maxPrice },
			category: category,
		})
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([[sort, direction]]);

		return res.status(200).send({
			success: true,
			data: products,
			totalProducts: totalProducts,
			totalPages: totalPages,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getAllProductsForAdminPage = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;

	// Get total number of orders
	let totalProducts;
	// If search query is not empty, get total number of orders that match search query
	if (search != '' && search != null) {
		totalProducts = await Product.find({
			title: { $regex: search, $options: 'i' },
		}).count();
	} else {
		totalProducts = await Product.find().count();
	}

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalProducts / pageSize);

	console.log(totalPages);

	try {
		let products;
		if (
			page != null &&
			pageSize != null &&
			sort != null &&
			direction != null &&
			search != ''
		) {
			products = await Product.find({
				title: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize && search != '' && search != null) {
			products = await Product.find({
				title: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort != null && direction != null && search != '') {
			products = await Product.find({
				title: { $regex: search, $options: 'i' },
			}).sort([[sort, direction]]);
		} else if (
			page != null &&
			pageSize != null &&
			sort != null &&
			direction != null
		) {
			products = await Product.find()
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page != null && pageSize != null) {
			products = await Product.find()
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort != null && direction != null) {
			products = await Product.find().sort([[sort, direction]]);
		} else {
			products = await Product.find();
		}

		console.log(products);
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

exports.getProductsMinMaxPrices = async (req, res) => {
	try {
		const max = await Product.find()
			.sort([['price', 'desc']])
			.limit(1);
		const min = await Product.find()
			.sort([['price', 'asc']])
			.limit(1);

		return res.status(200).send({
			success: true,
			minPrice: min,
			maxPrice: max,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.getProductsMinMaxPricesByCategory = async (req, res) => {
	let { category } = req.params;

	try {
		const max = await Product.find({ category: category })
			.sort([['price', 'desc']])
			.limit(1);
		const min = await Product.find({ category: category })
			.sort([['price', 'asc']])
			.limit(1);

		return res.status(200).send({
			success: true,
			minPrice: min,
			maxPrice: max,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
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
			// Upload product varitaion images to cloudinary
			let imagesArray = [];
			for (let image of variations[i].images) {
				const uploadRes = await uploadToCloudinary(image, 'shop');

				imagesArray.push(uploadRes);
			}

			console.log(names[i]);
			let nameValue =
				names[i].length == 1 ? String(names[i]) : names[i].join('-');
			const result = await ProductVariation.findOneAndUpdate(
				{ productId: productId, name: nameValue },
				{
					$set: {
						productId: productId,
						price: variations[i].price,
						stock: variations[i].price,
						images: imagesArray,
						name: nameValue,
					},
				},
				{ upsert: true, new: true }
			);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}

	return res.status(200).send({
		success: true,
		data: 'Product variations created.',
	});
};
