import { loginStart, loginFailure, loginSuccess } from './userRedux';
import { request } from '../api';

const catchError = (error) => {
	if (error?.response?.data) {
		return error.response.data;
	} else {
		return { success: false, error: error.message };
	}
};

export const login = async (dispatch, userCredentials) => {
	dispatch(loginStart());
	try {
		const res = await request.post('/auth/login', userCredentials);
		dispatch(loginSuccess(res.data));
		return res.data;
	} catch (error) {
		dispatch(loginFailure());
		return catchError(error);
	}
};

export const register = async (userCredentials) => {
	try {
		const res = await request.post('/auth/register', userCredentials);
		return res.data;
	} catch (error) {
		return catchError(error);
	}
};
