// src/components/Kelas.jsx
import React, { useState, useEffect } from 'react';

function Kelas() {
  const [materi, setMateri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://683c682b28a0b0f2fdc712c6.mockapi.io/api/v1/matkul')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setMateri(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading materi...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Kelas</h1>
      <ul>
        {materi.map((item) => (
          <li key={item.id} className="mb-4 border p-4 rounded shadow-sm">
            <h2 className="font-semibold text-lg">{item.nama || item.name}</h2>
            <p>Status: {item.status}</p>
            <p>Total SKS: {item.total_sks}</p>
            <p>NomorInduk: {item.NomorInduk}</p>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default Kelas;
