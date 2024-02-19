const ProductVariation = require('../models/ProductVariation');
const Category = require('../models/Category');
const Product = require('../models/Product');

const { removeFromCloudinary } = require('./cloudinary');

exports.getAllCategories = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;

	// Get total number of orders
	let totalCategories;
	// If search query is not empty, get total number of orders that match search query
	if (search != '' && search != null) {
		totalCategories = await Category.find({
			name: { $regex: search, $options: 'i' },
		}).count();
	} else {
		totalCategories = await Category.find().count();
	}

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalCategories / pageSize);

	try {
		let categories;
		if (page && pageSize && sort && direction && search != '') {
			categories = await Category.find({
				name: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize && search != '') {
			categories = await Category.find({
				name: { $regex: search, $options: 'i' },
			})
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort && direction && search != '') {
			categories = await Category.find({
				name: { $regex: search, $options: 'i' },
			}).sort([[sort, direction]]);
		} else if (page && pageSize && sort && direction) {
			categories = await Category.find()
				.limit(pageSize)
				.skip(pageSize * page)
				.sort([[sort, direction]]);
		} else if (page && pageSize) {
			categories = await Category.find()
				.limit(pageSize)
				.skip(pageSize * page);
		} else if (sort && direction) {
			categories = await Category.find().sort([[sort, direction]]);
		} else {
			categories = await Category.find();
		}
		return res.status(200).send({
			success: true,
			data: categories,
			totalCategories: totalCategories,
			totalPages: totalPages,
		});
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getCategoryById = async (req, res) => {
	const { id } = req.params;
	try {
		const category = await Category.findById(id);
		return res.status(200).send({ success: true, data: category });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getCategoryByName = async (req, res) => {
	const { name } = req.params;
	try {
		const category = await Category.find({ name: name });
		return res.status(200).send({ success: true, data: category });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.createCategory = async (req, res) => {
	const { name, selectedFields } = req.body;

	// Check if category already exists
	const foundCategory = await Category.find({ name: name });

	if (foundCategory.length > 0) {
		return res.status(500).send({
			success: false,
			error: 'Category with that name already exists',
		});
	}

	const newCategory = new Category({ name: name, fields: [...selectedFields] });

	try {
		const savedCategory = await newCategory.save();
		return res.status(200).send({ success: true, data: savedCategory });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.editCategory = async (req, res) => {
	try {
		const updatedCategory = await Category.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		return res.status(200).send({ success: true, data: updatedCategory });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category) {
			return res
				.status(404)
				.send({ success: false, error: 'Category not found' });
		}

		// Find all products containing category
		const productsContainingCategory = await Product.find({
			category: category.name,
		});

		// Find all variants linked to products
		let productVariantsArray = [];
		for (let product of productsContainingCategory) {
			const productVariants = await ProductVariation.find({
				productId: product._id,
			});

			for (let productVariant of productVariants) {
				productVariantsArray.push(productVariant);
			}
		}

		// Delete all product variants images
		for (let productVariant of productVariantsArray) {
			if (productVariant?.images && productVariant?.images?.length > 0) {
				for (let image of productVariant.images) {
					await removeFromCloudinary(image.public_id);
				}
			}
			// Delete product variant
			await ProductVariation.findByIdAndDelete(productVariant._id);
		}

		// Delete all product images from all products
		for (let product of productsContainingCategory) {
			for (let productImage of product.images) {
				await removeFromCloudinary(productImage.public_id);
			}
		}

		// Delete all products containing category
		await Product.deleteMany({ category: category.name });

		// Delete category
		await category.deleteOne();

		return res
			.status(200)
			.send({ success: true, message: 'Category has been deleted' });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};
