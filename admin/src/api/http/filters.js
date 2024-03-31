import { userRequest } from '../../api';

export const generateFilters = (categoryName) => {
	return userRequest.get('/filters/generate/' + categoryName);
};
