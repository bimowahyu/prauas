// src/pages/ClassModule.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Accordion from '../components/Accordion';
import AskTeacherModal from '../components/AskTeacherModal';
import ProgressBar from '../components/Progressbar';

const ClassModule = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterialId, setSelectedMaterialId] = useState(null);
    const [completedMaterials, setCompletedMaterials] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load completed materials from localStorage
        const storedCompletedMaterials = JSON.parse(localStorage.getItem('completedMaterials')) || [];
        setCompletedMaterials(storedCompletedMaterials);

        // Fetch materials from API
        fetch('https://683c682b28a0b0f2fdc712c6.mockapi.io/api/v1/matkul')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch materials');
                return res.json();
            })
            .then((data) => {
                // Map API data to format expected by Accordion component
                const mappedMaterials = data.map(item => ({
                    id: item.id,
                    title: item.nama || item.name,
                    description: `Status: ${item.status}, SKS: ${item.total_sks}`, // Example description
                    total_sks: parseInt(item.total_sks, 10) || 0,
                }));
                setMaterials(mappedMaterials);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleAccordionClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleOpenModal = (materialId) => {
        setSelectedMaterialId(materialId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSendQuestion = (question) => {
        // Simulate sending question to teacher
        console.log('Question sent:', question);
        toast.success('Pertanyaan berhasil dikirim!');
        setIsModalOpen(false);
    };

    const handleMarkComplete = (materialId) => {
        const updatedCompletedMaterials = [...completedMaterials];

        if (!updatedCompletedMaterials.includes(materialId)) {
            updatedCompletedMaterials.push(materialId);
            setCompletedMaterials(updatedCompletedMaterials);
            localStorage.setItem('completedMaterials', JSON.stringify(updatedCompletedMaterials));
            toast.success('Materi ditandai sebagai selesai!');
        } else {
            const filteredMaterials = updatedCompletedMaterials.filter(id => id !== materialId);
            setCompletedMaterials(filteredMaterials);
            localStorage.setItem('completedMaterials', JSON.stringify(filteredMaterials));
            toast.info('Tanda selesai dihapus!');
        }
    };

    const calculateProgress = () => {
        return materials.length > 0 ? (completedMaterials.length / materials.length) * 100 : 0;
    };

    if (loading) return <div>Loading materi...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Modul Pembelajaran</h1>
                <p className="text-gray-600 mb-6">Daftar materi yang harus Anda pelajari</p>

                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">Progress Belajar Anda</h2>
                    <ProgressBar progress={calculateProgress()} />
                    <div className="text-sm text-gray-600 mt-2">
                        {completedMaterials.length} dari {materials.length} materi telah selesai
                    </div>
                </div>

                <div className="space-y-4">
                    {materials.map((material, index) => (
                        <Accordion
                            key={material.id}
                            title={material.title}
                            description={material.description}
                            isOpen={activeIndex === index}
                            isCompleted={completedMaterials.includes(material.id)}
                            onClick={() => handleAccordionClick(index)}
                            onMarkComplete={() => handleMarkComplete(material.id)}
                            onAskTeacher={() => handleOpenModal(material.id)}
                        />
                    ))}
                </div>
            </div>

            <AskTeacherModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSend={handleSendQuestion}
                materialId={selectedMaterialId}
            />
        </div>
    );
};

export default ClassModule;
