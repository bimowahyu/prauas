/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDosen } from '../hooks/useDosen.js';

const initialForm = {
  nama: '',
  NomorInduk: '',
  email: '',
  telepon: '',
  Fakultas: '',
  Matkul: '',
  status: 'Aktif',
};

const Dosen = () => {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const {
    dosens,
    isLoading,
    isError,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
    limit,
  } = useDosen(page);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!form.nama) return alert('Nama dosen harus diisi');
    const dataToSend = {
      ...form,
      Matkul: form.Matkul.split(',').map(k => k.trim()).filter(Boolean),
    };
    addMutation.mutate(dataToSend, {
      onSuccess: () => setForm(initialForm),
    });
  };

  const handleEdit = (dosen) => {
    setEditingId(dosen.id);
    setForm({
      nama: dosen.nama || '',
      NomorInduk: dosen.NomorInduk || '',
      email: dosen.email || '',
      telepon: dosen.telepon || '',
      Fakultas: dosen.Fakultas || '',
      Matkul: dosen.Matkul?.join(', ') || '',
      status: dosen.status || 'Aktif',
    });
  };

  const handleUpdate = () => {
    if (!form.nama) return alert('Nama dosen harus diisi');
    const dataToSend = {
      ...form,
      Matkul: form.Matkul.split(',').map(k => k.trim()).filter(Boolean),
    };
    updateMutation.mutate(
      { id: editingId, data: dataToSend },
      {
        onSuccess: () => {
          setForm(initialForm);
          setEditingId(null);
        },
      }
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return;
    deleteMutation.mutate(id);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Manajemen Dosen</h2>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <input type="text" name="nama" placeholder="Nama Dosen" value={form.nama} onChange={handleChange} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <input type="text" name="NomorInduk" placeholder="NomorInduk" value={form.NomorInduk} onChange={handleChange} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <input type="text" name="telepon" placeholder="Telepon" value={form.telepon} onChange={handleChange} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <input type="text" name="Fakultas" placeholder="Fakultas" value={form.Fakultas} onChange={handleChange} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <input type="text" name="Matkul" placeholder="Matkul (pisah dengan koma)" value={form.Matkul} onChange={handleChange} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <select name="status" value={form.status} onChange={handleChange} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Cuti</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
            <div className="flex justify-end space-x-2 col-span-2">
              {editingId ? (
                <>
                  <button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Batal</button>
                  <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                </>
              ) : (
                <button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Tambah Dosen</button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {isLoading && <div>Loading data...</div>}
          {isError && <div>Error: {error.message}</div>}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Nama</th>
                  <th className="p-3 border-b">NomorInduk</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Telepon</th>
                  <th className="p-3 border-b">Fakultas</th>
                  <th className="p-3 border-b">Matkul</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dosens.map((dosen) => (
                  <tr key={dosen.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{dosen.id}</td>
                    <td className="p-3 border-b">{dosen.nama}</td>
                    <td className="p-3 border-b">{dosen.NomorInduk}</td>
                    <td className="p-3 border-b">{dosen.email}</td>
                    <td className="p-3 border-b">{dosen.telepon}</td>
                    <td className="p-3 border-b">{dosen.Fakultas}</td>
                    <td className="p-3 border-b">{dosen.Matkul?.join(', ')}</td>
                    <td className="p-3 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${dosen.status === 'Aktif' ? 'bg-green-100 text-green-800' : dosen.status === 'Cuti' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{dosen.status}</span>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex justify-between space-x-2">
                        <button onClick={() => handleEdit(dosen)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                        <button onClick={() => handleDelete(dosen.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Prev</button>
              <span>Halaman {page}</span>
              <button onClick={() => setPage(old => old + 1)} disabled={dosens.length < limit} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dosen;
