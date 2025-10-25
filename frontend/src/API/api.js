import axios from './axiosConfig';

const BASE_URL = 'http://127.0.0.1:8000/api/'
const LOGIN_URL = `${BASE_URL}token/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const LOGOUT_URL = `${BASE_URL}token/logout/`
const AUTH_CHECK_URL = `${BASE_URL}token/authenticated/`
const USER_URL = `${BASE_URL}user/users/me/`

export const login = async (email, password) => {
	const response = await axios.post(LOGIN_URL, {email: email, password: password}, {withCredentials: true});
	return response.data.success;
}

export const refresh_token = async () => {
	try {
		const response = await axios.post(REFRESH_URL, {}, { withCredentials: true });
		return response.data.success;
	} catch (error) {
		console.error("Error refreshing token:", error);
		return false;
	}
}

export const logout = async () => {
	try {
		const response = await axios.post(LOGOUT_URL, {}, {
			withCredentials: true
		});
		return response.data.success;
	} catch (error) {
		console.error("Error during logout:", error);
		return false;
	}		
}

export const isAuthenticated = async () => {
	try {
		const response = await axios.post(AUTH_CHECK_URL, {}, { withCredentials: true });
		return response.data.success;
	}
	catch (error) {
		console.error("Error checking authentication:", error);
		return false;
	}
}

/*
PETICIONES NO RELACIONADAS A LA AUTENTICACION
*/

export const getUser = async () => {
	const response = await axios.get(USER_URL, { withCredentials: true });
	return response.data;
}

export const getEventRegisteredUser = (userId) => {
	return axios.get(`http://127.0.0.1:8000/api/event/user/${userId}/confirmed`, { withCredentials: true });
}

export const getEventPendingUser = (userId) => {
	return axios.get(`http://127.0.0.1:8000/api/event/user/${userId}/pending`, { withCredentials: true });
}

export const getEventCreatedUser = (userId) => {
	return axios.get(`http://127.0.0.1:8000/api/event/by-creator/${userId}`, { withCredentials: true });
}

export const createEvent = (data) => {
	return axios.post('http://127.0.0.1:8000/api/event/events/', data, { withCredentials: true });
}
