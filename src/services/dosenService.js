import api from "../api";

export const getAllDosen = () => api.get("/dosen");
export const getDosenById = (id) => api.get(`/dosen/${id}`);
export const createDosen = (data) => api.post("/dosen", data);
export const updateDosen = (id, data) => api.put(`/dosen/${id}`, data);
export const deleteDosen = (id) => api.delete(`/dosen/${id}`);
