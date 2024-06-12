import { userRequest } from '../../api';

export const getOrdersStats = () => {
	return userRequest.get('orders/count');
};

export const getLatestOrders = () => {
	return userRequest.get('orders/?pageSize=4&page=0');
};

export const getOrders = (sort, direction, page, pageSize, searchTermValue) => {
	return userRequest.get('/orders', {
		params: {
			sort: sort,
			direction: direction,
			page: page,
			pageSize: pageSize,
			search: searchTermValue.toString(),
		},
	});
};
