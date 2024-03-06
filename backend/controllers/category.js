const ProductVariation = require('../models/ProductVariation');
const Category = require('../models/Category');
const Product = require('../models/Product');

const { removeFromCloudinary } = require('./cloudinary');

// Service
const {
	getCategoryById,
	getCategoryByName,
	createCategory,
	editCategory,
	getAllCategories,
	getCategoriesCount,
} = require('../services/category');

exports.getAllCategories = async (req, res) => {
	const { sort, direction, page, pageSize, search } = req.query;

	// Get total number of categories
	let totalCategories = await getCategoriesCount(search);

	// Calculate number of pages based on page size
	const totalPages = Math.ceil(totalCategories / pageSize);

	try {
		let categories = await getAllCategories(
			page,
			pageSize,
			sort,
			direction,
			search
		);
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
		const category = await getCategoryById(id);
		return res.status(200).send({ success: true, data: category });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.getCategoryByName = async (req, res) => {
	const { name } = req.params;
	try {
		const category = await getCategoryByName(name);
		return res.status(200).send({ success: true, data: category });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.createCategory = async (req, res) => {
	const { name, selectedFields } = req.body;

	// Check if category already exists
	const foundCategory = await getCategoryByName(name);

	if (foundCategory.length > 0) {
		return res.status(500).send({
			success: false,
			error: 'Category with that name already exists',
		});
	}

	try {
		const savedCategory = await createCategory(name, selectedFields);
		return res.status(200).send({ success: true, data: savedCategory });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.editCategory = async (req, res) => {
	const { name, selectedFields } = req.body;
	const { id } = req.params;

	try {
		const updatedCategory = await editCategory(id, name, selectedFields);
		return res.status(200).send({ success: true, data: updatedCategory });
	} catch (err) {
		return res.status(500).send({ success: false, error: err });
	}
};

exports.deleteCategory = async (req, res) => {
	const { id } = req.params;
	try {
		const category = await getCategoryById(id);

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
