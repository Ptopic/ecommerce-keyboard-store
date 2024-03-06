const ProductVariation = require('../models/ProductVariation');
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getCategoriesCount = async (search) => {
	let totalCategories;
	// If search query is not empty, get total number of categories that match search query
	if (search != '' && search != null) {
		totalCategories = await Category.find({
			name: { $regex: search, $options: 'i' },
		}).count();
	} else {
		totalCategories = await Category.find().count();
	}
	return totalCategories;
};

exports.getAllCategories = async (page, pageSize, sort, direction, search) => {
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
	return categories;
};

exports.getCategoryById = async (id) => {
	const foundCategory = await Category.findById(id);
	return foundCategory;
};

exports.getCategoryByName = async (name) => {
	const foundCategory = await Category.find({ name: name });
	return foundCategory;
};

exports.createCategory = async (name, selectedFields) => {
	const newCategory = new Category({
		name: name,
		fields: [...selectedFields],
	});
	const savedCategory = await newCategory.save();

	return savedCategory;
};

exports.editCategory = async (id, name, selectedFields) => {
	const updatedCategory = await Category.findByIdAndUpdate(
		id,
		{
			$set: {
				name: name,
				fields: selectedFields,
			},
		},
		{ new: true }
	);

	return updatedCategory;
};
