import axios from 'axios';

const BASE_URL = import.meta.env.VITE_URL;
let TOKEN = '';
if (localStorage.getItem('persist:root') != undefined) {
	let userObj = JSON.parse(localStorage.getItem('persist:root')).user;
	TOKEN = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user)
		.currentUser?.token;
}

export const request = axios.create({
	baseURL: BASE_URL,
});

// export const user_request = axios.create({
// 	baseURL: BASE_URL,
// 	headers: { token: TOKEN },
// });

export const user_request = (tokenVal) => {
	if (tokenVal) {
		return axios.create({
			baseURL: BASE_URL,
			headers: { token: tokenVal },
		});
	} else {
		return axios.create({
			baseURL: BASE_URL,
			headers: { token: TOKEN },
		});
	}
};

export const admin_request = (tokenVal) => {
	if (tokenVal) {
		return axios.create({
			baseURL: BASE_URL,
			headers: { token: tokenVal },
		});
	} else {
		return axios.create({
			baseURL: BASE_URL,
			headers: { token: TOKEN },
		});
	}
};

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
