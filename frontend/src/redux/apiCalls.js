import { loginStart, loginFailure, loginSuccess } from './userRedux';
import { request } from '../api';

export const API_URL = import.meta.env.VITE_URL;

export const login = async (dispatch, userCredentials) => {
	// const res = await request.post('/auth/login', userCredentials);
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

export const register = async (dispatch, userCredentials) => {
	const res = await fetch(`${API_URL}auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userCredentials),
	});

	const data = await res.json();

	console.log(data);
	// Set user in redux when user registers
	if (res.ok) {
		dispatch(loginSuccess(data.data));
	} else {
		dispatch(loginFailure());
	}
	return data;
};
