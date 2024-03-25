import { userRequest } from '../../api';

export const getOrdersStats = () => {
	return userRequest.get('orders/count');
};

export const getLatestOrders = () => {
	return userRequest.get('orders/?pageSize=4&page=0');
};
