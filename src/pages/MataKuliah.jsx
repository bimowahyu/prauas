import React, { useState } from 'react';
import Modal from './modal';
import { useMatkul } from '../hooks/useMataKuliah';

const initialForm = {
  nama: '',
  NomorInduk: '',
  status: 'Aktif',
  total_sks: 0,
};

const MataKuliah = () => {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'alert', onConfirm: null, onCancel: null });

  const {
    matkuls,
    isLoading,
    isError,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
    limit
  } = useMatkul(page);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.nama || !form.NomorInduk || form.total_sks <= 0) {
      setModalContent({
        title: 'Validasi',
        message: 'Semua data wajib diisi dan total SKS harus > 0',
        type: 'alert',
        onConfirm: () => setShowModal(false),
      });
      setShowModal(true);
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form }, {
        onSuccess: () => {
          setForm(initialForm);
          setEditingId(null);
          setModalContent({ title: 'Sukses', message: 'Berhasil diperbarui!', type: 'alert', onConfirm: () => setShowModal(false) });
          setShowModal(true);
        }
      });
    } else {
      addMutation.mutate(form, {
        onSuccess: () => {
          setForm(initialForm);
          setModalContent({ title: 'Sukses', message: 'Berhasil ditambahkan!', type: 'alert', onConfirm: () => setShowModal(false) });
          setShowModal(true);
        }
      });
    }
  };

  const handleEdit = (matkul) => {
    setForm(matkul);
    setEditingId(matkul.id);
  };

  const handleDelete = (id) => {
    setModalContent({
      title: 'Konfirmasi Hapus',
      message: 'Yakin ingin menghapus data ini?',
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Manajemen Mata Kuliah</h1>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama Mata Kuliah" className="border rounded-md px-3 py-2" />
          <input name="NomorInduk" value={form.NomorInduk} onChange={handleChange} placeholder="Nomor Induk" className="border rounded-md px-3 py-2" />
          <select name="status" value={form.status} onChange={handleChange} className="border rounded-md px-3 py-2">
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
          <input type="number" name="total_sks" value={form.total_sks} onChange={handleChange} placeholder="Total SKS" className="border rounded-md px-3 py-2" />
        </div>
        <div className="flex justify-end space-x-2">
          {editingId && (
            <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded-md">Batal</button>
          )}
          <button
            onClick={handleSubmit}
            className={`${editingId ? 'bg-blue-500' : 'bg-green-500'} text-white px-4 py-2 rounded-md`}
          >
            {editingId ? 'Update' : 'Tambah'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-500">Error: {error?.message}</p>
        ) : (
          <>
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">ID</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Nomor Induk</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Total SKS</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {matkuls.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-4">Tidak ada data</td></tr>
                ) : (
                  matkuls.map(matkul => (
                    <tr key={matkul.id} className="border-t">
                      <td className="p-2">{matkul.id}</td>
                      <td className="p-2">{matkul.nama}</td>
                      <td className="p-2">{matkul.NomorInduk}</td>
                      <td className="p-2">{matkul.status}</td>
                      <td className="p-2">{matkul.total_sks}</td>
                      <td className="p-2 space-x-2">
                        <button onClick={() => handleEdit(matkul)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                        <button onClick={() => handleDelete(matkul.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded-md">Prev</button>
              <span>Halaman {page}</span>
              <button onClick={() => setPage(old => old + 1)} disabled={matkuls.length < limit} className="px-4 py-2 bg-gray-200 rounded-md">Next</button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
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

export default MataKuliah;
