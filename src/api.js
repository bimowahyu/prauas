import axios from "axios";

export const apiV1 = axios.create({
  baseURL: "https://683c682b28a0b0f2fdc712c6.mockapi.io/api/v1/",
});

export const apiV2 = axios.create({
  baseURL: "https://683c72e528a0b0f2fdc73599.mockapi.io/api/v2/",
});

// interceptors for error handling can be added similarly for both instances

// API v1
// export const fetchDosens = () => apiV1.get("/dosen");
export const fetchDosens = (page = 1, limit = 5) =>
  apiV1.get(`/dosen?page=${page}&limit=${limit}`);
export const addDosen = (data) => apiV1.post("/dosen", data);
export const updateDosen = (id, data) => apiV1.put(`/dosen/${id}`, data);
export const deleteDosen = (id) => apiV1.delete(`/dosen/${id}`);

export const fetchMatkuls = (page = 1, limit = 5) =>
  apiV1.get(`/matkul?page=${page}&limit=${limit}`);
export const addMatkul = (data) => apiV1.post("/matkul", data);
export const updateMatkul = (id, data) => apiV1.put(`/matkul/${id}`, data);
export const deleteMatkul = (id) => apiV1.delete(`/matkul/${id}`);

// Kelas
export const fetchKelas = (page = 1, limit = 5) =>
  apiV1.get(`/kelas?page=${page}&limit=${limit}`);
export const addKelas = (data) => apiV1.post("/kelas", data);
export const updateKelas = (id, data) => apiV1.put(`/kelas/${id}`, data);
export const deleteKelas = (id) => apiV1.delete(`/kelas/${id}`);

// API v2 (user & role)
export const fetchUsers = (page = 1, limit = 5) => apiV2.get(`/users?page=${page}&limit=${limit}`);
export const addUser = (data) => apiV2.post("/users", data);
export const updateUser = (id, data) => apiV2.put(`/users/${id}`, data);
export const deleteUser = (id) => apiV2.delete(`/users/${id}`);

export const fetchRoles = (page = 1, limit = 5) => apiV2.get(`/roles?page=${page}&limit=${limit}`);
export const addRole = (data) => apiV2.post("/roles", data);
export const updateRole = (id, data) => apiV2.put(`/roles/${id}`, data);
export const deleteRole = (id) => apiV2.delete(`/roles/${id}`);
