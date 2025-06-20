import api from "../api";

export const registerUser = (data) => api.post("/register", data);
export const getAllUsers = () => api.get("/users");
export const assignRole = (userId, role) =>
  api.post(`/users/${userId}/assign-role`, { role });
