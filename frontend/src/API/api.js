import axios from 'axios';

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

export const call_refresh = async (error, func) => {
	if (error.response && error.response.status === 401) {
		const refreshed = await refresh_token();
		if (refreshed) {
			const retryResponse = await func();
			return retryResponse.data;
		} else {
			console.log("Couldn't refresh the token, loging")
			await logout()
		}
	}
	return false;
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
		const response = await axios.post(AUTH_CHECK_URL, { withCredentials: true });
		return response.success;
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
	try {
		const response = await axios.get(USER_URL, { withCredentials: true });
		return response.data;
	}
	catch (error) {
		console.error("Error fetching user data:", error);
		return null;
	}
}

export const getEventRegisteredUser = () => {
	return axios.get('http://127.0.0.1:8000/api/event/user/2/confirmed') 
}

export const getEventPendingUser = () => {
	return axios.get('http://127.0.0.1:8000/api/event/user/2/pending') 
}

export const getEventCreatedUser = () => {
	return axios.get('http://127.0.0.1:8000/api/event/by-creator/2') 
}


export const createEvent = (data) => axios.post('http://127.0.0.1:8000/api/event/events/',data) //mi url va aca
