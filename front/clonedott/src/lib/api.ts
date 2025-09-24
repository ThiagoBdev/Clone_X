
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
});

api.interceptors.request.use((config) => {

  const publicEndpoints = [
    '/api/users/register/',
    '/api/token/',
    '/api/token/refresh/', 
  ];

  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );

  if (!isPublicEndpoint && typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;