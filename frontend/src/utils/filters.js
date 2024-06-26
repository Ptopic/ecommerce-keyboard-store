import { userRequest } from '../api';
import { getQueryClient } from '../../../admin/src/shared/queryClient';

const queryClient = getQueryClient;

export const generateFilterProductAdmin = async (
	selectedCategory,
	activeFilters,
	curCategory,
	setFilters,
	setActiveFilters,
	setActiveFileds,
	namesOfActiveFields,
	setIsFiltersLoading
) => {
	const allProductsRes = await userRequest.get(
		`/products/filters/` + selectedCategory,
		{
			params: {
				activeFilters: activeFilters != [] ? activeFilters : null,
			},
		}
	);

	let productsData = allProductsRes.data.data;

	// Get category by name
	let categoryFields = curCategory.fields;

	let filtersArray = [];
	let initialFiltersArray = [];

	if (initialFiltersArray.length == 0) {
		for (let filter of categoryFields) {
			let obj = {};
			let initialFilter = {};
			obj[filter.name] = new Set([]);
			initialFilter[filter.name] = '';
			filtersArray.push(obj);
			initialFiltersArray.push(initialFilter);
		}
	}

	setActiveFilters(initialFiltersArray);

	for (let product of productsData) {
		// Loop thru all products details
		for (let i = 0; i < categoryFields.length; i++) {
			let filterName = categoryFields[i].name;

			let productFilter = product.details[filterName.toString()];

			let filterSet = filtersArray[i][filterName.toString()];

			filterSet.add(productFilter);
		}
	}

	// Loop thru all filters to sort its sets
	for (let j = 0; j < filtersArray.length; j++) {
		let curSet = Object.values(filtersArray[j])[0];

		// Sort filter set
		let sortedArrayFromSet = Array.from(curSet).sort((a, b) =>
			('' + a).localeCompare(b, undefined, { numeric: true })
		);

		curSet.clear();

		// Add sorted values back into set
		for (let value of sortedArrayFromSet) {
			curSet.add(value);
		}
	}

	// Set react query data
	queryClient.setQueryData(
		['products', 'admin', 'filters', curCategory],
		filtersArray
	);
	queryClient.setQueryData(
		['products', 'admin', 'activeFields', curCategory],
		namesOfActiveFields
	);

	setFilters(filtersArray);
	setActiveFileds(namesOfActiveFields);

	setIsFiltersLoading ? setIsFiltersLoading(false) : null;

	let returnObj = {};

	returnObj['filters'] = filtersArray;
	returnObj['activeFilters'] = initialFiltersArray;

	return returnObj;
};

export const generateFilters = async (
	name,
	activeFilters,
	categories,
	setFilters,
	setActiveFilters
) => {
	// Get all products by category to generate filters for it
	const allProductsRes = await userRequest.get(`/products/filters/` + name, {
		params: {
			activeFilters:
				activeFilters && activeFilters.length > 0 ? activeFilters : null,
		},
	});

	let productsData = allProductsRes.data.data;

	let categoryFields;

	let foundCategory = categories.find((category) => category.name === name);

	if (foundCategory?.fields == []) {
		setFilters(null);
		setActiveFilters(null);
		return;
	}

	categoryFields = foundCategory?.fields;

	let filtersArray = [];
	let initialFiltersArray = [];

	if (initialFiltersArray.length == 0) {
		if (!categoryFields) {
			return;
		} else {
			for (let filter of categoryFields) {
				let obj = {};
				let initialFilter = {};
				obj[filter.name] = new Set([]);
				initialFilter[filter.name] = '';
				filtersArray.push(obj);
				initialFiltersArray.push(initialFilter);
			}
		}
	}

	setActiveFilters(initialFiltersArray);

	for (let product of productsData) {
		// Loop thru all products details
		for (let i = 0; i < categoryFields.length; i++) {
			let filterName = categoryFields[i].name;

			let productFilter = product.details[filterName.toString()];

			let filterSet = filtersArray[i][filterName.toString()];

			filterSet.add(productFilter);
		}
	}

	// Loop thru all filters to sort its sets
	for (let j = 0; j < filtersArray.length; j++) {
		let curSet = Object.values(filtersArray[j])[0];

		// Sort filter set
		let sortedArrayFromSet = Array.from(curSet).sort((a, b) =>
			('' + a).localeCompare(b, undefined, { numeric: true })
		);

		curSet.clear();

		// Add sorted values back into set
		for (let value of sortedArrayFromSet) {
			curSet.add(value);
		}
	}

	setFilters(filtersArray);

	let returnObj = {};

	returnObj['filters'] = filtersArray;
	returnObj['activeFilters'] = initialFiltersArray;

	return returnObj;
};

export const regenerateFilters = async (
	name,
	activeFilters,
	categories,
	setFilters,
	setActiveFilters
) => {
	// Get all products by category to generate filters for it
	const allProductsRes = await userRequest.get(`/products/filters/` + name, {
		params: {
			activeFilters:
				activeFilters && activeFilters.length > 0 ? activeFilters : null,
		},
	});

	let productsData = allProductsRes.data.data;

	let foundCategory = categories.find((category) => category.name === name);

	if (foundCategory?.fields == []) {
		setFilters(null);
		setActiveFilters(null);
		return;
	}

	let categoryFields = foundCategory?.fields;

	let filtersArray = [];

	if (!categoryFields) {
		return;
	} else {
		for (let filter of categoryFields) {
			let obj = {};
			obj[filter.name] = new Set([]);
			filtersArray.push(obj);
		}
	}

	for (let product of productsData) {
		// Loop thru all products details
		for (let i = 0; i < categoryFields.length; i++) {
			let filterName = categoryFields[i].name;

			let productFilter = product.details[filterName.toString()];

			let filterSet = filtersArray[i][filterName.toString()];

			filterSet.add(productFilter);
		}
	}

	// Loop thru all filters to sort its sets
	for (let j = 0; j < filtersArray.length; j++) {
		let curSet = Object.values(filtersArray[j])[0];

		// Sort filter set
		let sortedArrayFromSet = Array.from(curSet).sort((a, b) =>
			('' + a).localeCompare(b, undefined, { numeric: true })
		);

		curSet.clear();

		// Add sorted values back into set
		for (let value of sortedArrayFromSet) {
			curSet.add(value);
		}
	}

	setFilters([...filtersArray]);
};
