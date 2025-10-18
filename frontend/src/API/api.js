import axios from 'axios';

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
