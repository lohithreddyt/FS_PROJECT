import api from "./client.js";
import axios from "axios";

axios.defaults.withCredentials = true;  
export const authApi = {
  login: payload => api.post("/auth/login", payload).then(r => r.data),
  register: payload => api.post("/auth/register", payload).then(r => r.data),
  sendOtp: payload => api.post("/auth/otp/send", payload),
  verifyOtp: payload => api.post("/auth/otp/verify", payload),
  session: () => api.get("/auth/session").then(r => r.data),
  logout: () => api.post("/auth/logout"),
};

export const listingApi = {
  list: () => api.get("/listings").then(r => r.data),
  create: payload => api.post("/listings", payload).then(r => r.data),
  updateStatus: (id, payload) => api.patch(`/listings/${id}/status`, payload).then(r => r.data),
  remove: id => api.delete(`/listings/${id}`),
};

export const recommendationApi = {
  list: () => api.get("/recommendations").then(r => r.data),
  create: payload => api.post("/recommendations", payload).then(r => r.data),
  remove: id => api.delete(`/recommendations/${id}`),
};

export const analyticsApi = {
  get: () => api.get("/analytics").then(r => r.data),
};
