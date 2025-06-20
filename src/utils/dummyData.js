// src/utils/dummyData.js
export const users = [
  {
    id: 1,
    name: "Mahasiswa Demo",
    email: "student@example.com",
    password: "password123",
    studentId: "12345678",
    program: "Teknik Informatika",
  },
  {
    id: 2,
    name: "Admin Demo",
    email: "admin@example.com",
    password: "admin123",
    studentId: "87654321",
    program: "Sistem Informasi",
  },
];

export const materials = [
  {
    id: 1,
    title: "Pengenalan React JS",
    sks: 2,
    description:
      "Pada materi ini, Anda akan mempelajari dasar-dasar React JS, termasuk konsep Virtual DOM, JSX, dan komponen. React adalah library JavaScript yang populer untuk membangun antarmuka pengguna yang interaktif dan responsif.",
  },
  {
    id: 2,
    title: "State dan Props",
    sks: 3,

    description:
      "Pelajari cara mengelola data dalam aplikasi React menggunakan state dan props. State digunakan untuk data yang berubah dari waktu ke waktu, sedangkan props digunakan untuk meneruskan data dari komponen induk ke komponen anak.",
  },
  {
    id: 3,
    title: "Lifecycle Methods",
    sks: 5,

    description:
      "Memahami siklus hidup komponen React dan metode-metode yang terkait dengannya. Termasuk componentDidMount, componentDidUpdate, dan componentWillUnmount, serta cara menggunakan hooks seperti useEffect sebagai alternatif.",
  },
  {
    id: 4,
    title: "React Hooks",
    sks: 5,

    description:
      "Mempelajari fitur hooks di React yang memungkinkan Anda menggunakan state dan fitur React lainnya tanpa menulis kelas. Anda akan belajar tentang useState, useEffect, useContext, dan hooks lainnya yang berguna.",
  },
  {
    id: 5,
    title: "React Router",
    sks: 2,

    description:
      "Implementasi routing di aplikasi React menggunakan React Router. Pelajari cara membuat navigasi di aplikasi single page application (SPA) dan mengelola URL serta parameter URL.",
  },
  {
    id: 6,
    title: "Manajemen State dengan Redux",
    sks: 2,

    description:
      "Pengenalan Redux sebagai solusi manajemen state yang dapat digunakan bersama React. Pelajari tentang store, actions, reducers, dan middleware serta cara mengintegrasikannya dengan aplikasi React.",
  },
  {
    id: 7,
    title: "Styling di React",
    sks: 2,
    description:
      "Berbagai cara untuk melakukan styling pada komponen React, termasuk CSS biasa, CSS Modules, Styled Components, dan framework CSS seperti Tailwind CSS dan Bootstrap.",
  },
  {
    id: 8,
    title: "Pengujian di React",
    sks: 2,
    description:
      "Cara menulis dan menjalankan pengujian untuk aplikasi React menggunakan tools seperti Jest dan React Testing Library. Pelajari tentang unit testing, integration testing, dan snapshot testing.",
  },
];
