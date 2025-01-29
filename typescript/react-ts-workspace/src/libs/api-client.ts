import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 69000, 
    headers: {
        "Content-Type": "application/json",
        'accept': 'application/json'
    },
});

export default apiClient