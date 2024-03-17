import { request, userRequest } from '../../api';

export const getCategories = () => {
	return request('/categories');
};
