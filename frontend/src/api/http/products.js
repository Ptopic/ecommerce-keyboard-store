import { request, userRequest } from '../../api';

let PAGE_SIZE = 12;

export const getInitialProducts = async (
	category,
	priceSliderValues,
	sort,
	direction
) => {
	return request.get(`/products/category/` + category, {
		params: {
			page: 0,
			pageSize: PAGE_SIZE,
			minPrice: priceSliderValues[0] != 0 ? priceSliderValues[0] : null,
			maxPrice: priceSliderValues[1] != 0 ? priceSliderValues[1] : null,
			sort: sort != '' ? sort : null,
			direction: direction != '' ? direction : null,
		},
	});
};

export const getProducts = async (
	category,
	page,
	priceSliderValues,
	sort,
	direction,
	activeFilters
) => {
	return request.get(`/products/category/` + category, {
		params: {
			page: page ? page : 0,
			pageSize: 12,
			minPrice: priceSliderValues[0] != 0 ? priceSliderValues[0] : null,
			maxPrice: priceSliderValues[1] != 0 ? priceSliderValues[1] : null,
			sort: sort != '' ? sort : null,
			direction: direction != '' ? direction : null,
			activeFilters:
				activeFilters && activeFilters.length > 0 ? activeFilters : null,
		},
	});
};

export const getAllProducts = async (
	page,
	sort,
	direction,
	priceSliderValues
) => {
	return request.get(`/products/all`, {
		params: {
			page: page ? page : 1,
			pageSize: 12,
			minPrice: priceSliderValues[0] != 0 ? priceSliderValues[0] : null,
			maxPrice: priceSliderValues[1] != 0 ? priceSliderValues[1] : null,
			sort: sort != '' ? sort : null,
			direction: direction != '' ? direction : null,
		},
	});
};

export const getProductPrices = async (category, activeFilters) => {
	return request.get('/products/prices/' + category, {
		params: {
			activeFilters: activeFilters != [] ? activeFilters : null,
		},
	});
};
