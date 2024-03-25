import { request, userRequest } from '../../api';

export const getUsersStats = () => {
	return userRequest.get('/user/count');
};

export const getUsers = (sort, direction, page, pageSize, searchTermValue) => {
	return userRequest.get('/user', {
		params: {
			sort: sort,
			direction: direction,
			page: page,
			pageSize: pageSize,
			search: searchTermValue,
		},
	});
};
