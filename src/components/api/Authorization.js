import axios from "axios";
export const Token = axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("userToken");
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
