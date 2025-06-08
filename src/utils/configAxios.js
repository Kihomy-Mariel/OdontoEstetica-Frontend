import axios from "axios";

// lee la URL desde la variable de entorno
const BASE_URL = import.meta.env.VITE_API_URL;

console.log("🔗 Backend baseURL:", BASE_URL);
const axiosConsultorio = axios.create({
  baseURL:BASE_URL,
});

// inyecta el token en cada petición
axiosConsultorio.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});


export { axiosConsultorio };