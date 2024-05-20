import axios from 'axios';

import { Cookies as ReactCookie } from 'react-cookie';

import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_URL;

// Get token from cookie
const cookies = new ReactCookie();
let TOKEN = cookies?.cookies?.token ? cookies?.cookies?.token : '';

export const request = axios.create({
	baseURL: BASE_URL,
});

export const userRequest = axios.create({
	baseURL: BASE_URL,
	headers: { Authorization: `Bearer ${TOKEN}` },
});

userRequest.interceptors.response.use(
	(response) => {
		if (response.status === 401 || response.status === 403) {
			Cookies.remove('token');
			window.location.reload();
		}
		return response;
	},
	(error) => error
);

export const user_request = (tokenVal) => {
	if (tokenVal) {
		return axios.create({
			baseURL: BASE_URL,
			headers: { Authorization: `Bearer ${TOKEN}` },
		});
	} else {
		return axios.create({
			baseURL: BASE_URL,
			headers: { Authorization: `Bearer ${TOKEN}` },
		});
	}
};
