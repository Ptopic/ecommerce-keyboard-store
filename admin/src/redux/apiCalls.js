import { loginStart, loginFailure, loginSuccess } from './userRedux';
import { request } from '../api';

export const login = async (dispatch, user) => {
	dispatch(loginStart());
	try {
		const res = await request.post('/auth/login', user);
		dispatch(loginSuccess(res.data));
	} catch (error) {
		dispatch(loginFailure());
	}
};
