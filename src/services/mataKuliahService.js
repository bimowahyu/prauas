import api from "../api";

export const getAllMataKuliah = () => api.get("/matakuliah");
export const createMataKuliah = (data) => api.post("/matakuliah", data);
export const updateMataKuliah = (id, data) =>
  api.put(`/matakuliah/${id}`, data);
export const deleteMataKuliah = (id) => api.delete(`/matakuliah/${id}`);
