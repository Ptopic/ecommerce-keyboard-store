import axios from 'axios';

import { Cookies } from 'react-cookie';

const BASE_URL = import.meta.env.VITE_API_URL;

// Get token from cookie
const cookies = new Cookies();
let TOKEN = cookies.cookies.token;

export const request = axios.create({
	baseURL: BASE_URL,
});

export const userRequest = axios.create({
	baseURL: BASE_URL,
	headers: { Authorization: `Bearer ${TOKEN}` },
});

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
