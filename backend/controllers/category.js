const Category = require('../models/Category');

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
		console.log(err);
		return res.status(500).send({ success: false, error: err });
	}
};

exports.createCategory = async (req, res) => {
	const { name } = req.body;

	const newCategory = new Category({ name });
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
		await Category.findByIdAndDelete(req.params.id);
		return res
			.status(200)
			.send({ success: true, message: 'Category has been deleted' });
	} catch (error) {
		return res.status(500).send({ success: false, error: err });
	}
};
