import axios from 'axios';


const api = axios.create({
  baseURL: '/data', // This will resolve to /public/data in dev ; can be easily swapped to an API URL later
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
