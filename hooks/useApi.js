import { useToken } from "@/context/TokenContext";
import axios from "axios";

export const useApi = () => {
  const { token, removeToken } = useToken();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const api = axios.create({
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${token}` },
  });

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) removeToken();
      return Promise.reject(err);
    }
  );
  return api;
};
