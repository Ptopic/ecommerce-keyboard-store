import { request, userRequest } from '../../api';

export const getCategories = (
	sort,
	direction,
	page,
	pageSize,
	searchTermValue
) => {
	return userRequest.get('/categories', {
		params: {
			sort: sort,
			direction: direction,
			page: page,
			pageSize: pageSize,
			search: searchTermValue,
		},
	});
};
