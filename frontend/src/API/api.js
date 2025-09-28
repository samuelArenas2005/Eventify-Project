import axios from 'axios';

export const getAllEvent = () => {
	return axios.get('http://127.0.0.1:8000/api/v1/events/') //mi url va aca
}

export const createEvent = (data) => axios.post('http://127.0.0.1:8000/api/v1/events/',data) //mi url va aca
