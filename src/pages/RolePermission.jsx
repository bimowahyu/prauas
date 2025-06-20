/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useRole } from '../hooks/useRole';
import Modal from './modal';

const initialForm = {
  name: '',
  permissions: '',
};

const RolePermission = () => {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'alert',
    onConfirm: null,
    onCancel: null,
  });

  const {
    roles,
    isLoading,
    isError,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
    limit,
  } = useRole(page, (err) => {
    setModalContent({
      title: 'Error',
      message: err?.message || 'Terjadi kesalahan.',
      type: 'alert',
      onConfirm: () => setShowModal(false),
    });
    setShowModal(true);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name) {
      setModalContent({
        title: 'Validasi',
        message: 'Nama role wajib diisi.',
        type: 'alert',
        onConfirm: () => setShowModal(false),
      });
      setShowModal(true);
      return;
    }

    const dataToSend = {
      ...form,
      permissions: form.permissions.split(',').map((p) => p.trim()).filter(Boolean),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: dataToSend });
    } else {
      addMutation.mutate(dataToSend);
    }

    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (role) => {
    setEditingId(role.id);
    setForm({
      name: role.name,
      permissions: Array.isArray(role.permissions) ? role.permissions.join(', ') : '',
    });
  };

  const handleDelete = (id) => {
    setModalContent({
      title: 'Konfirmasi Hapus',
      message: 'Yakin ingin menghapus role ini?',
      type: 'confirm',
      onConfirm: () => {
        deleteMutation.mutate(id);
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-600">
        <p>Memuat data role...</p>
        <Modal
          show={true}
          title="Memuat Data"
          message="Sedang memuat daftar role dan permission..."
          type="alert"
          onConfirm={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Manajemen Role & Permission</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Role"
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="permissions"
            value={form.permissions}
            onChange={handleChange}
            placeholder="Permissions (pisah dengan koma, cth: read,write,delete)"
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-2">
          {editingId && (
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              Batal
            </button>
          )}
          <button
            onClick={handleSubmit}
            className={`${
              editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-2 rounded-md transition-colors duration-200`}
          >
            {editingId ? 'Update' : 'Tambah Role'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama Role</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Permissions</th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Tidak ada data role.
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">{role.id}</td>
                  <td className="p-3 text-sm text-gray-700">{role.name}</td>
                  <td className="p-3 text-sm text-gray-700">
                    {Array.isArray(role.permissions) ? role.permissions.join(', ') : '-'}
                  </td>
                  <td className="p-3 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Kontrol Paginasi */}
        <div className="flex justify-between items-center mt-4 p-2 bg-gray-50 rounded-b-lg">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700">Halaman {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={roles.length < limit || isLoading}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        show={showModal}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
        onCancel={modalContent.onCancel}
        type={modalContent.type}
      />
    </div>
  );
};

export default RolePermission;
