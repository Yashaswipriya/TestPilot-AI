import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle global 401s here later if needed
    return Promise.reject(error);
  }
);

export default api;
