import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:4007',
    timeout: 69000, 
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
    },
});

export default apiClient
