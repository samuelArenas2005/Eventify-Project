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

export const confirmAttendance = async (eventId, status = 'CONFIRMED') => {
  try {
    const response = await axios.put(
      `${BASE_URL}event/events/${eventId}/confirm_attendance/`,
      { status: status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error al confirmar asistencia:", error);
    throw error;
  }
}