import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMatkuls, addMatkul, updateMatkul, deleteMatkul } from '../api'; 
import Modal from './modal'; 

const initialForm = {
    nama: '',
    NomorInduk: '',
    status: 'Aktif',
    total_sks: 0,
};

const limit = 5;

const MataKuliah = () => {
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'alert', onConfirm: null, onCancel: null });
    const queryClient = useQueryClient();

    const { data: matkuls = [], isLoading, isError } = useQuery({
        queryKey: ['matkuls', page],
        queryFn: () => fetchMatkuls(page, limit).then((res) => res.data),
        keepPreviousData: true,
    });

    const mutationAdd = useMutation({
        mutationFn: addMatkul,
        onSuccess: () => {
            queryClient.invalidateQueries(['matkuls']);
            setForm(initialForm);
            // Optionally show a success message
            setModalContent({ title: 'Sukses', message: 'Mata kuliah berhasil ditambahkan!', type: 'alert', onConfirm: () => setShowModal(false) });
            setShowModal(true);
        },
        onError: (error) => {
            setModalContent({ title: 'Error', message: `Gagal menambahkan mata kuliah: ${error.message}`, type: 'alert', onConfirm: () => setShowModal(false) });
            setShowModal(true);
        }
    });

    const mutationUpdate = useMutation({
        mutationFn: ({ id, data }) => updateMatkul(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['matkuls']);
            setForm(initialForm);
            setEditingId(null);
            // Optionally show a success message
            setModalContent({ title: 'Sukses', message: 'Mata kuliah berhasil diperbarui!', type: 'alert', onConfirm: () => setShowModal(false) });
            setShowModal(true);
        },
        onError: (error) => {
            setModalContent({ title: 'Error', message: `Gagal memperbarui mata kuliah: ${error.message}`, type: 'alert', onConfirm: () => setShowModal(false) });
            setShowModal(true);
        }
    });

    const mutationDelete = useMutation({
        mutationFn: deleteMatkul,
        onSuccess: () => {
            queryClient.invalidateQueries(['matkuls']);
            // Optionally show a success message
            setModalContent({ title: 'Sukses', message: 'Mata kuliah berhasil dihapus!', type: 'alert', onConfirm: () => setShowModal(false) });
            setShowModal(true);
        },
        onError: (error) => {
            setModalContent({ title: 'Error', message: `Gagal menghapus mata kuliah: ${error.message}`, type: 'alert', onConfirm: () => setShowModal(false) });
            setShowModal(true);
        }
    });

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
                onConfirm: () => setShowModal(false)
            });
            setShowModal(true);
            return;
        }

        if (editingId) {
            mutationUpdate.mutate({ id: editingId, data: form });
        } else {
            mutationAdd.mutate(form);
        }
    };

    const handleEdit = (matkul) => {
        setForm(matkul);
        setEditingId(matkul.id);
    };

    const handleDelete = (id) => {
        setModalContent({
            title: 'Konfirmasi Hapus',
            message: 'Yakin ingin menghapus mata kuliah ini?',
            type: 'confirm',
            onConfirm: () => {
                mutationDelete.mutate(id);
                setShowModal(false);
            },
            onCancel: () => setShowModal(false)
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

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                        name="nama"
                        value={form.nama}
                        onChange={handleChange}
                        placeholder="Nama Mata Kuliah"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        name="NomorInduk"
                        value={form.NomorInduk}
                        onChange={handleChange}
                        placeholder="Nomor Induk"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                    </select>
                    <input
                        type="number"
                        name="total_sks"
                        value={form.total_sks}
                        onChange={handleChange}
                        placeholder="Total SKS"
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
                        {editingId ? 'Update' : 'Tambah'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                {isLoading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : isError ? (
                    <p className="text-center text-red-500">Error loading data</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                                        <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nomor Induk</th>
                                        <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total SKS</th>
                                        <th className="p-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matkuls.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4 text-gray-500">Tidak ada data mata kuliah.</td>
                                        </tr>
                                    ) : (
                                        matkuls.map((matkul) => (
                                            <tr key={matkul.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                                <td className="p-3 text-sm text-gray-700">{matkul.id}</td>
                                                <td className="p-3 text-sm text-gray-700">{matkul.nama}</td>
                                                <td className="p-3 text-sm text-gray-700">{matkul.NomorInduk}</td>
                                                <td className="p-3 text-sm text-gray-700">{matkul.status}</td>
                                                <td className="p-3 text-sm text-gray-700">{matkul.total_sks}</td>
                                                <td className="p-3 text-sm space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(matkul)}
                                                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(matkul.id)}
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
                        </div>
                        <div className="flex justify-between items-center mt-4 p-2 bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>
                            <span className="text-gray-700">Page {page}</span>
                            <button
                                onClick={() => setPage((old) => old + 1)}
                                disabled={matkuls.length < limit}
                                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
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

export default MataKuliah;
