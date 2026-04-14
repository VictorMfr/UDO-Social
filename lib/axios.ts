import axios, { AxiosInstance } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default api;
