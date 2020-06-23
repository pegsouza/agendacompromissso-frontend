import axios from 'axios';

const api = axios.create({
    baseURL: 'https://agendacompromisso-backend.herokuapp.com'
});

export default api;
