import axios from 'axios';

const BASE_URL = import.meta.env.VITE_URL;
const TOKEN = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user)
	.currentUser.token;
// const TOKEN = currentUser.token;

export const request = axios.create({
	baseURL: BASE_URL,
});

export const userRequest = axios.create({
	baseURL: BASE_URL,
	header: { token: TOKEN },
});
