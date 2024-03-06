const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');

const {
	uploadToCloudinary,
	removeFromCloudinary,
} = require('../controllers/cloudinary');

exports.mapActiveFields = (activeFields, req) => {
	let details = {};

	for (let field of activeFields) {
		details[field] = String(req.body[field]);
	}
	return details;
};

exports.uploadProductImages = async (images) => {
	let imagesArray = [];
	for (let image of images) {
		const uploadRes = await uploadToCloudinary(image, 'shop');

		imagesArray.push(uploadRes);
	}
	return imagesArray;
};

exports.searchProducts = async (term) => {
	let termString = String(term);

	let numberString = parseInt(term);

	let products = await Product.find({
		$or: [
			!isNaN(numberString) // If number search by price
				? {
						$expr: {
							$eq: ['$price', termString],
						},
				  }
				: { title: { $regex: termString, $options: 'i' } }, // Else search by title
		],
	});
	return products;
};

exports.getTotalProducts = async (search) => {
	// Get total number of orders
	let totalProducts;
	// If search query is not empty, get total number of orders that match search query
	if (search != '' && search != null) {
		totalProducts = await Product.find({
			$or: [
				{ title: { $regex: search, $options: 'i' } },
				{ category: { $regex: search, $options: 'i' } },
			],
		}).count();
	} else {
		totalProducts = await Product.find().count();
	}
	return totalProducts;
};

exports.getAllProducts = async (sort, direction, page, pageSize, search) => {
	let products;
	if (
		page != null &&
		pageSize != null &&
		sort != null &&
		direction != null &&
		search != ''
	) {
		products = await Product.find({
			$or: [
				{ title: { $regex: search, $options: 'i' } },
				{ category: { $regex: search, $options: 'i' } },
			],
		})
			.limit(pageSize)
			.skip(pageSize * page)
			.sort([[sort, direction]]);
	} else if (page && pageSize && search != '' && search != null) {
		products = await Product.find({
			$or: [
				{ title: { $regex: search, $options: 'i' } },
				{ category: { $regex: search, $options: 'i' } },
			],
		})
			.limit(pageSize)
			.skip(pageSize * page);
	} else if (sort != null && direction != null && search != '') {
		products = await Product.find({
			$or: [
				{ title: { $regex: search, $options: 'i' } },
				{ category: { $regex: search, $options: 'i' } },
			],
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
	return products;
};
