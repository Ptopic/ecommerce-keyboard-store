import { userRequest } from '../../api';

export const generateFilters = (categoryName, activeFilters) => {
	return userRequest.get('/filters/generate/' + categoryName, {
		params: { activeFilters },
	});
};
