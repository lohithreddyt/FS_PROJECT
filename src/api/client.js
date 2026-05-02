import axios from "axios";

export const API_BASE_URL = "https://fs-project-backend-hffr.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
