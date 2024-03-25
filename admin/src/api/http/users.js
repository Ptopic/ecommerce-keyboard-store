import { request, userRequest } from '../../api';

export const getUsersStats = () => {
	return userRequest.get('/user/count');
};
