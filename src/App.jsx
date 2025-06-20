// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClassModule from './pages/ClassModule';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dosen from './pages/Dosen';
import MataKuliah from './pages/MataKuliah';
import RegisterUser from './pages/RegisterUser';
import RolePermission from './pages/RolePermission';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kelas" element={<ClassModule />} />
          <Route path="dosen" element={<Dosen />} />
          <Route path="matakuliah" element={<MataKuliah />} />
          <Route path="registrasi" element={<RegisterUser />} />
          <Route path="role-permission" element={<RolePermission />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;