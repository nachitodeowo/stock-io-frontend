import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stock-io-backend-docker.onrender.com/api/',
});

api.interceptors.request.use(
  (config) => {
    // Buscamos el token con los nombres más comunes
    const token = localStorage.getItem('token') || localStorage.getItem('access');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🟢 Token enviado al backend:", token.substring(0, 10) + "..."); // Solo para verificar
    } else {
      console.log("🔴 NO se encontró ningún token en LocalStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;