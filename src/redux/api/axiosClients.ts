import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants/base_url";
import { refreshTokenFn } from "../slices/users/auth/refreshToken";

const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // sends cookies automatically
});

// Response interceptor for 401 → refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try refreshing token via backend
        await refreshTokenFn(); // backend sets new auth_token cookie
        return axiosClient(originalRequest); // retry original request
      } catch (refreshError) {
        // Refresh failed → user needs to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
