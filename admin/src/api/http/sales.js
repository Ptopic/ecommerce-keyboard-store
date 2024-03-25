import { request, userRequest } from '../../api';

export const getSales = () => {
	return userRequest.get('/orders/income');
};
