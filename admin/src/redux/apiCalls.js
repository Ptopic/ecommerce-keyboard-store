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

		// Set localStorage.currentUser to res.data instead of waiting for page refresh

		return res.data;
	} catch (error) {
		dispatch(loginFailure());
		console.log(error);
		return catchError(error);
	}
};
