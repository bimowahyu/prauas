/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import ProgressBar from '../components/Progressbar';
import Modal from './modal';
import { fetchMatkuls, fetchDosens, fetchUsers, fetchKelas } from '../api'; 

const MAX_SKS_DOSEN = 24;
const MAX_SKS_MAHASISWA = 20;

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [completedMaterials, setCompletedMaterials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'alert', onConfirm: null });
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setModalContent({
                title: 'Akses Ditolak',
                message: 'Anda harus login untuk mengakses halaman ini.',
                type: 'alert',
                onConfirm: () => {
                    setShowModal(false);
                    navigate('/');
                }
            });
            setShowModal(true);
        }
        const storedCompletedMaterials = JSON.parse(localStorage.getItem('completedMaterials')) || [];
        setCompletedMaterials(storedCompletedMaterials);
    }, [navigate]);
    const {
        data: materials = [],
        isLoading: isLoadingMaterials,
        isError: isErrorMaterials,
        error: materialsError,
    } = useQuery({
        queryKey: ['dashboardMaterials'],
        queryFn: () => fetchMatkuls(1, 100).then((res) => res.data),
        enabled: !!user,
        onError: (err) => {
            setModalContent({
                title: 'Error Data',
                message: `Gagal memuat data materi: ${err.message}`,
                type: 'alert',
                onConfirm: () => setShowModal(false)
            });
            setShowModal(true);
        },
    });
    const {
        data: dosens = [],
        isLoading: isLoadingDosens,
        isError: isErrorDosens,
        error: dosensError,
    } = useQuery({
        queryKey: ['dashboardDosens'],
        queryFn: () => fetchDosens(1, 100).then((res) => res.data),
        enabled: !!user,
        onError: (err) => {
            setModalContent({
                title: 'Error Data',
                message: `Gagal memuat data dosen: ${err.message}`,
                type: 'alert',
                onConfirm: () => setShowModal(false)
            });
            setShowModal(true);
        },
    });

    const {
        data: mahasiswas = [],
        isLoading: isLoadingMahasiswas,
        isError: isErrorMahasiswas,
        error: mahasiswasError,
    } = useQuery({
        queryKey: ['dashboardMahasiswas'],
        queryFn: () => fetchUsers(1, 100).then((res) => res.data),
        enabled: !!user,
        onError: (err) => {
            setModalContent({
                title: 'Error Data',
                message: `Gagal memuat data mahasiswa: ${err.message}`,
                type: 'alert',
                onConfirm: () => setShowModal(false)
            });
            setShowModal(true);
        },
    });
    const totalMaterials = materials.length;
    const completedCount = completedMaterials.length; 
    
    const totalSKS = completedMaterials.reduce((sum, completedId) => {
        const mat = materials.find((m) => m.id === completedId);
        return mat ? sum + Number(mat.total_sks) : sum;
    }, 0);

    const progressPercentage = totalMaterials > 0 ? (completedCount / totalMaterials) * 100 : 0;

    const progressChartData = [
        { name: 'Selesai', value: completedCount },
        { name: 'Belum Selesai', value: totalMaterials - completedCount },
    ];
    const COLORS_PROGRESS = ['#82ca9d', '#FF6B6B'];
    const sksChartData = [
        { name: 'SKS Diambil', value: totalSKS },
        { name: 'SKS Maks Mahasiswa', value: MAX_SKS_MAHASISWA },
    ];
    const COLORS_SKS = ['#007bff', '#ffc107']; 
    const materialStatusCounts = materials.reduce((acc, material) => {
        acc[material.status] = (acc[material.status] || 0) + 1;
        return acc;
    }, {});

    const materialStatusChartData = Object.keys(materialStatusCounts).map(status => ({
        name: status === 'Aktif' ? 'Materi Aktif' : 'Materi Nonaktif',
        value: materialStatusCounts[status]
    }));
    const COLORS_STATUS = ['#4CAF50', '#FF9800'];
    const handleContinueClick = () => {
        navigate('/admin/kelas'); 
    };

    if (!user || isLoadingMaterials || isLoadingDosens || isLoadingMahasiswas) {
        return (
            <div className="flex justify-center mt-10">
                <p className="text-gray-600">Memuat Dashboard...</p>
                <Modal
                    show={true}
                    title="Memuat Dashboard"
                    message="Sedang memuat data dashboard..."
                    type="alert"
                    onConfirm={() => {}} 
                />
            </div>
        );
    }

    if (isErrorMaterials || isErrorDosens || isErrorMahasiswas) {
        return (
            <div className="flex justify-center mt-10 text-red-500">
                <p>Error: Gagal memuat data dashboard.</p>
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
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Selamat datang, {user.name}!</h2>
                    <p className="text-gray-700 mb-2">Program: {user.program}</p>
                    <p className="text-gray-700 mb-6">NIM: {user.studentId}</p>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2 text-gray-700">Progress Belajar Anda</h3>
                        <ProgressBar progress={progressPercentage} />
                        <div className="text-sm text-gray-600 mt-2">
                            {completedCount} dari {totalMaterials} materi telah selesai ({Math.round(progressPercentage)}%)
                        </div>
                        <div className="text-sm text-gray-600 mt-1 font-semibold">
                            Total SKS yang sudah diambil: {totalSKS}
                        </div>
                        <div className="mt-2 text-sm text-red-600 font-medium">
                            Maksimal SKS Dosen: {MAX_SKS_DOSEN} | Maksimal SKS Mahasiswa: {MAX_SKS_MAHASISWA}
                        </div>
                        {totalSKS > MAX_SKS_MAHASISWA && (
                            <div className="mt-1 text-sm text-red-700 font-bold animate-pulse">
                                Perhatian: Total SKS mahasiswa melebihi batas maksimal!
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleContinueClick}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Lanjutkan Belajar
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Chart 1: Progress Belajar (Donut Chart) */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Progress Belajar Materi</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={progressChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {progressChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_PROGRESS[index % COLORS_PROGRESS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chart 2: Perbandingan SKS (Bar Chart) */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Perbandingan SKS</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                data={sksChartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8">
                                    {sksChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_SKS[index % COLORS_SKS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chart 3: Distribusi Status Mata Kuliah (Pie Chart) */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Status Materi Mata Kuliah</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={materialStatusChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {materialStatusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Pengumuman Terbaru</h3>
                        <ul className="text-gray-700">
                            <li className="py-2 border-b border-gray-100">Ujian tengah semester akan dimulai pada tanggal 15 Mei</li>
                            <li className="py-2 border-b border-gray-100">Jadwal asistensi lab telah diperbarui</li>
                            <li className="py-2">Pengumpulan tugas besar diperpanjang hingga 20 April</li>
                        </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Aktivitas Terakhir</h3>
                        <div className="text-gray-700">
                            <p className="py-2 border-b border-gray-100">Anda baru saja menyelesaikan {completedCount} materi</p>
                            <p className="py-2 border-b border-gray-100">Sisa {totalMaterials - completedCount} materi untuk diselesaikan</p>
                            <p className="py-2">Terus semangat belajar!</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={showModal}
                title={modalContent.title}
                message={modalContent.message}
                onConfirm={modalContent.onConfirm}
                type={modalContent.type}
            />
        </div>
    );
};

export default Dashboard;
