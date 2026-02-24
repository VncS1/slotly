import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("slotly_token");
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("slotly_token");

  if (token && token !== "undefined" && token !== "null") {
    const cleanToken = token.replace(/['"]+/g, "");

    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});
