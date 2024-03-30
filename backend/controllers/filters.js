const Product = require('../models/Product');
const { getCategoryByName } = require('../services/category');

exports.generateFilters = async (req, res) => {
	const { categoryName } = req.params;

	let query = { category: categoryName };

	try {
		let products = await Product.find(query);

		// console.log(products);

		const category = await getCategoryByName(categoryName);

		let categoryFields = category[0].fields;

		let filtersArray = [];
		let activeFieldsArray = [];

		if (activeFieldsArray.length == 0) {
			for (let filter of categoryFields) {
				let obj = {};
				let initialFilter = {};
				obj[filter.name] = new Set([]);
				initialFilter[filter.name] = '';
				filtersArray.push(obj);
				activeFieldsArray.push(initialFilter);
			}
		}

		for (let product of products) {
			// Loop thru all products details
			for (let i = 0; i < categoryFields.length; i++) {
				let filterName = categoryFields[i].name;

				let productFilter = product.details[filterName.toString()];

				let filterSet = filtersArray[i][filterName.toString()];

				filterSet.add(productFilter);
			}
		}

		// Loop thru all filters to sort its sets
		let newFiltersArray = [];
		for (let j = 0; j < filtersArray.length; j++) {
			let curSet = Object.values(filtersArray[j])[0];

			// Sort filter set
			let sortedArrayFromSet = Array.from(curSet).sort((a, b) =>
				('' + a).localeCompare(b, undefined, { numeric: true })
			);

			let key = Object.keys(filtersArray[j])[0];

			let newFilterObj = {};
			newFilterObj[key] = sortedArrayFromSet;
			newFiltersArray.push(newFilterObj);
		}

		return res.status(200).send({
			success: true,
			filters: newFiltersArray,
			activeFields: activeFieldsArray,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};

exports.regenerateFilters = async (req, res) => {
	const { category } = req.params;
	let { activeFilters } = req.query;

	let query = { category: category };

	if (activeFilters != null && activeFilters.length > 0) {
		for (let activeFilter of activeFilters) {
			if (Object.values(activeFilter)[0] != '') {
				query['details.' + Object.keys(activeFilter)] =
					Object.values(activeFilter)[0];
			}
		}
	}

	try {
		let products = await Product.find(query);

		console.log(products);

		const category = await getCategoryByName(category);

		console.log(category);

		// return res.status(200).send({
		// 	success: true,
		// 	data: products,
		// });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, error: error });
	}
};
