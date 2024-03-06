const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const {
	mapActiveFields,
	uploadProductImages,
	searchProducts,
	getAllProducts,
	getTotalProducts,
} = require('../services/products');

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
			let details = mapActiveFields(activeFields, req);

			let imagesArray = await uploadProductImages(images);

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
			let details = mapActiveFields(activeFields, req);

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
		colors,
		sizes,
		materials,
		names,
	} = req.body;

	const { id } = req.params;

	price = parseFloat(price).toFixed(2);

	try {
		if (images) {
			let details = {};
			if (activeFields) {
				// Map active fields to details object
				details = mapActiveFields(activeFields, req);
			}

			let imagesArray = await uploadProductImages(images);

			// Clear any existing keys in details that are not in new detauks array
			Object.keys(details).forEach((key) => {
				if (!activeFields.includes(key)) {
					delete details[key];
				}
			});

			let updatedProduct = await Product.findByIdAndUpdate(
				id,
				{
					$set: {
						title: title,
						specifications: specifications,
						description: description,
						category: category,
						details: details,
						price: price,
						stock: stock,
						materials: materials ? materials : [],
						colors: colors ? colors : [],
						sizes: sizes ? sizes : [],
						variationNames: names ? names : [],
					},
					$push: {
						images: { $each: imagesArray },
					},
				},
				{ new: true }
			);
			return res.status(200).send({ success: true, data: updatedProduct });
		} else {
			let details = {};
			if (activeFields) {
				// Map active fields to details object
				details = mapActiveFields(activeFields, req);
			}

			let updatedProduct = await Product.findByIdAndUpdate(
				id,
				{
					$set: {
						title: title,
						specifications: specifications,
						description: description,
						category: category,
						details: details,
						price: price,
						stock: stock,
						materials: materials ? materials : [],
						colors: colors ? colors : [],
						sizes: sizes ? sizes : [],
						variationNames: names ? names : [],
					},
				},
				{ new: true }
			);
			return res.status(200).send({ success: true, data: updatedProduct });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
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

	try {
		// Search for product that contains term
		let products = await searchProducts(term);
		return res.status(200).send({ success: true, data: products });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.getAllProducts = async (req, res) => {
	let { sort, direction, page, pageSize, minPrice, maxPrice } = req.query;

	// If sort and direction is null use default
	if (sort == null && direction == null) {
		(sort = 'createdAt'), (direction = 'desc');
	}

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
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.getAllProductsByCategoryWithoutPagination = async (req, res) => {
	let { category } = req.params;
	let { activeFilters } = req.query;

	let query = { category: category };

	if (activeFilters != null) {
		for (let activeFilter of activeFilters) {
			if (Object.values(activeFilter)[0] != '') {
				query['details.' + Object.keys(activeFilter)] =
					Object.values(activeFilter)[0];
			}
		}
	}

	try {
		let products;
		// Sortiraj prema najnovijima po defaultu
		products = await Product.find(query);

		return res.status(200).send({
			success: true,
			data: products,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.getAllProductsByCategory = async (req, res) => {
	let { category } = req.params;
	let {
		sort,
		direction,
		page,
		pageSize,
		minPrice,
		maxPrice,
		activeFilters,
		search,
	} = req.query;

	// If sort and direction is null use default
	if (sort == null && direction == null) {
		(sort = 'createdAt'), (direction = 'desc');
	}

	let query = {};
	if (minPrice && maxPrice) {
		if (search) {
			query = {
				price: { $gte: minPrice, $lte: maxPrice },
				category: category,
				title: { $regex: search, $options: 'i' },
			};
		} else {
			query = {
				price: { $gte: minPrice, $lte: maxPrice },
				category: category,
			};
		}
	} else {
		query = { category: category };
	}

	if (activeFilters != null) {
		for (let activeFilter of activeFilters) {
			if (Object.values(activeFilter)[0] != '') {
				query['details.' + Object.keys(activeFilter)] =
					Object.values(activeFilter)[0];
			}
		}
	}

	// Get total number of products
	let totalProducts;
	if (minPrice && maxPrice) {
		totalProducts = await Product.find(query).count();
	} else {
		totalProducts = await Product.find(query).count();
	}

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalProducts / pageSize);

	try {
		let products;

		// Sortiraj prema najnovijima po defaultu
		products = await Product.find(query)
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([[sort, direction]]);

		return res.status(200).send({
			success: true,
			data: products,
			totalProducts: totalProducts,
			totalPages: totalPages,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.getAllProductsForAdminPage = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;

	// Get total number of orders
	let totalProducts = await getTotalProducts(search);

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalProducts / pageSize);

	try {
		let products = await getAllProducts(
			sort,
			direction,
			page,
			pageSize,
			search
		);
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
	let { activeFilters } = req.query;

	let query = { category: category };

	if (activeFilters != null) {
		for (let activeFilter of activeFilters) {
			if (Object.values(activeFilter)[0] != '') {
				query['details.' + Object.keys(activeFilter)] =
					Object.values(activeFilter)[0];
			}
		}
	}

	try {
		const max = await Product.find(query)
			.sort([['price', 'desc']])
			.limit(1);
		const min = await Product.find(query)
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

			let nameValue =
				names[i].length == 1 ? String(names[i]) : names[i].join('-');
			const result = await ProductVariation.findOneAndUpdate(
				{ productId: productId, name: nameValue },
				{
					$set: {
						productId: productId,
						price: variations[i].price,
						stock: variations[i].stock,
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
