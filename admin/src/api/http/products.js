import { userRequest } from '../../api';

export const getProducts = (
	sort,
	direction,
	page,
	pageSize,
	searchTermValue
) => {
	return userRequest.get('/products/admin', {
		params: {
			sort: sort,
			direction: direction,
			page: page,
			pageSize: pageSize,
			search: searchTermValue,
		},
	});
};
