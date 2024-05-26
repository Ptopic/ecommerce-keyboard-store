import axios from 'axios';

import { Cookies as ReactCookie } from 'react-cookie';

import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_URL;
console.log(BASE_URL);

// Get token from cookie
const cookies = new ReactCookie();
let TOKEN = cookies.cookies.tokenAdmin;
console.log(TOKEN);

export const request = axios.create({
	baseURL: BASE_URL,
});

// export const user_request = axios.create({
// 	baseURL: BASE_URL,
// 	headers: { token: TOKEN },
// });

export const userRequest = axios.create({
	baseURL: BASE_URL,
	headers: { Authorization: `Bearer ${TOKEN}` },
});

// userRequest.interceptors.response.use(
// 	(response) => {
// 		console.log(response.status);
// 		if (response.status === 401 || response.status === 403) {
// 			Cookies.remove('token');
// 			window.location.reload();
// 		}
// 		return response;
// 	},
// 	(error) => error
// );

export const user_request = (tokenVal) => {
	return axios.create({
		baseURL: BASE_URL,
		headers: { Authorization: `Bearer ${tokenVal}` },
	});
};

export const admin_request = (tokenVal) => {
	return axios.create({
		baseURL: BASE_URL,
		headers: { Authorization: `Bearer ${tokenVal}` },
	});
};

// admin_request.interceptors.response.use(
// 	(response) => {
// 		if (response.status === 401 || response.status === 403) {
// 			Cookies.remove('token');
// 			window.location.href = '/';
// 		}
// 		return response;
// 	},
// 	(error) => error
// );

// user_request.defaults.headers.token = TOKEN;

// user_request.interceptors.request.use(
// 	(config) => {
// 		config.headers.token = JSON.parse(
// 			JSON.parse(localStorage.getItem('persist:root')).user
// 		).currentUser?.token;

// 		return config;
// 	},
// 	(error) => {
// 		console.log('request error', error);
// 		return Promise.reject(error);
// 	}
// );
