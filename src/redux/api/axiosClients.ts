// src/utils/axiosClient.ts
import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/constants/base_url";

export const createAxiosClient = (
  refreshFn: () => Promise<void>, // refresh token function
  logoutFn: () => void // logout function
) => {
  const client = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true,
  });

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError & { config?: any }) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await refreshFn();
          return client(originalRequest);
        } catch (err) {
          logoutFn();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};
