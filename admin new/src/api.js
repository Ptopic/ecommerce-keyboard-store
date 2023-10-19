import axios from 'axios';

const BASE_URL = 'http://192.168.1.200:3001/api/';
const TOKEN = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user)
	.currentUser.token;
export const request = axios.create({
	baseURL: BASE_URL,
});

export const user_request = axios.create({
	baseURL: BASE_URL,
	header: { token: TOKEN },
});
