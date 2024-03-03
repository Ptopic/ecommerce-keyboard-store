import { loginStart, loginFailure, loginSuccess } from './userRedux';
import { request } from '../api';

const catchError = (error) => {
	if (error?.response?.data) {
		return error.response.data;
	} else {
		return { success: false, error: error.message };
	}
};

export const API_URL = import.meta.env.VITE_API_URL;

export const login = async (dispatch, userCredentials) => {
	dispatch(loginStart());
	const res = await fetch(`${API_URL}auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userCredentials),
	});

	const data = await res.json();

	if (res.ok) {
		dispatch(loginSuccess(data.data));
	} else {
		dispatch(loginFailure());
	}
	return data;
};
