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

export const updateUser = async (userData) => {
	try {
		// Si hay un avatar, usar FormData para enviar el archivo
		const formData = new FormData();
		
		// Añadir campos al FormData
		if (userData.username !== undefined) formData.append('username', userData.username);
		if (userData.email !== undefined) formData.append('email', userData.email);
		if (userData.name !== undefined) formData.append('name', userData.name);
		if (userData.last_name !== undefined) formData.append('last_name', userData.last_name);
		if (userData.phone !== undefined) formData.append('phone', userData.phone || '');
		if (userData.codigo !== undefined) formData.append('codigo', userData.codigo || '');
		
		// Manejar contraseña (solo si se proporciona)
		if (userData.password) {
			formData.append('password', userData.password);
			formData.append('password2', userData.password2 || userData.password);
		}
		
		// Manejar avatar (solo si se proporciona un archivo)
		if (userData.avatar instanceof File) {
			formData.append('avatar', userData.avatar);
		}
		
		const response = await axios.put(
			`${BASE_URL}user/users/update_me/`,
			formData,
			{
				withCredentials: true,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
}

export const getEventRegisteredUser = () => {
  return axios.get(`${BASE_URL}event/confirmed/`, { withCredentials: true });
}

export const getEventPendingUser = () => {
  return axios.get(`${BASE_URL}event/pending/`, { withCredentials: true });
}

export const getEventCreatedUser = () => {
  return axios.get(`${BASE_URL}event/created/`, { withCredentials: true });
}

export const createEvent = (data) => {
	return axios.post(`${BASE_URL}event/events/`, data, { withCredentials: true });
}

export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}event/categories/`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error en getCategories:", error);
    return [];
  }
}

export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}event/active/`, { withCredentials: true });
    return response.data;  // Axios envuelve la respuesta en .data
  } catch (error) {
    console.error("Error en getAllEvents:", error);
    return [];  // Retornamos array vacío en caso de error
  }
}

export const getAllRegisteredEventsCount = () => {
  // Suponiendo que tienes un endpoint que trae TODOS los eventos registrados (activos y finalizados)
  return axios.get(`${BASE_URL}event/registered/all/`, { withCredentials: true });
}

export const getAllCreatedEventsCount = () => {
  // Suponiendo que tienes un endpoint que trae TODOS los eventos creados (activos y finalizados)
  return axios.get(`${BASE_URL}event/created/all/`, { withCredentials: true });
}