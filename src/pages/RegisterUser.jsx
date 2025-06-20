import React, { useState } from "react";
import { useUsers } from "../hooks/useMahasiswa";
import Modal from "./modal";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

const RegisterUser = () => {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "alert",
    onConfirm: null,
    onCancel: null,
  });

  const {
    users,
    isLoading,
    isError,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
    limit,
  } = useUsers(page);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      setModalContent({
        title: "Validasi",
        message: "Nama dan Email wajib diisi.",
        type: "alert",
        onConfirm: () => setShowModal(false),
      });
      setShowModal(true);
      return;
    }

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: form },
        {
          onSuccess: () => {
            setForm(initialForm);
            setEditingId(null);
            setModalContent({
              title: "Sukses",
              message: "User berhasil diperbarui!",
              type: "alert",
              onConfirm: () => setShowModal(false),
            });
            setShowModal(true);
          },
          onError: (err) => {
            setModalContent({
              title: "Error",
              message: `Gagal memperbarui user: ${err.message}`,
              type: "alert",
              onConfirm: () => setShowModal(false),
            });
            setShowModal(true);
          },
        }
      );
    } else {
      addMutation.mutate(form, {
        onSuccess: () => {
          setForm(initialForm);
          setModalContent({
            title: "Sukses",
            message: "User berhasil ditambahkan!",
            type: "alert",
            onConfirm: () => setShowModal(false),
          });
          setShowModal(true);
        },
        onError: (err) => {
          setModalContent({
            title: "Error",
            message: `Gagal menambahkan user: ${err.message}`,
            type: "alert",
            onConfirm: () => setShowModal(false),
          });
          setShowModal(true);
        },
      });
    }
  };

  const handleEdit = (userToEdit) => {
    setEditingId(userToEdit.id);
    setForm({
      name: userToEdit.name || "",
      email: userToEdit.email || "",
      password: "",
    });
  };

  const handleDelete = (id) => {
    setModalContent({
      title: "Konfirmasi Hapus",
      message: "Yakin ingin menghapus user ini?",
      type: "confirm",
      onConfirm: () => {
        deleteMutation.mutate(id, {
          onSuccess: () => {
            setModalContent({
              title: "Sukses",
              message: "User berhasil dihapus!",
              type: "alert",
              onConfirm: () => setShowModal(false),
            });
            setShowModal(true);
          },
          onError: (err) => {
            setModalContent({
              title: "Error",
              message: `Gagal menghapus user: ${err.message}`,
              type: "alert",
              onConfirm: () => setShowModal(false),
            });
            setShowModal(true);
          },
        });
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center text-gray-600">
        <p>Memuat data user...</p>
        <Modal
          show={true}
          title="Memuat Data"
          message="Sedang memuat daftar user..."
          type="alert"
          onConfirm={() => {}}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center text-red-500">
        <p>Error: {error?.message || "Terjadi kesalahan saat memuat data user."}</p>
        <Modal
          show={showModal}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
          type={modalContent.type}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Halaman Registrasi User</h1>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md w-full mb-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md w-full mb-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (Isi hanya jika ingin mengubah)"
          value={form.password}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md w-full mb-4 focus:ring-blue-500 focus:border-blue-500"
        />

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
              editingId
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white px-4 py-2 rounded-md transition-colors duration-200`}
          >
            {editingId ? "Update User" : "Tambah User"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="p-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nama
              </th>
              <th className="p-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="p-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  Tidak ada data user.
                </td>
              </tr>
            ) : (
              users.map((userItem) => (
                <tr
                  key={userItem.id}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-3 text-sm text-gray-700">{userItem.id}</td>
                  <td className="p-3 text-sm text-gray-700">{userItem.name}</td>
                  <td className="p-3 text-sm text-gray-700">{userItem.email}</td>
                  <td className="p-3 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(userItem)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(userItem.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
            disabled={users.length < limit || isLoading}
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

export default RegisterUser;
