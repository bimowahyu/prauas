import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Layout = () => {
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout',
            text: 'Apakah Anda yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('user');
                localStorage.removeItem('isLoggedIn');
                navigate('/');
            }
        });
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    if (!user) return <div>Loading...</div>;

    const getNavLinkClass = (path) =>
        location.pathname === path
            ? 'border-blue-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Modul/Kelas', path: '/admin/kelas' },
        { label: 'Dosen', path: '/admin/dosen' },
        { label: 'Mata Kuliah', path: '/admin/matakuliah' },
        { label: 'Registrasi User', path: '/admin/registrasi' },
        { label: 'Role & Permission', path: '/admin/role-permission' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center font-bold text-blue-600 text-xl">
                                SIKELEN
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {menuItems.map(({ label, path }) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${getNavLinkClass(
                                            path
                                        )}`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center space-x-3">
                            <span className="text-sm text-gray-700">{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                            >
                                Logout
                            </button>
                        </div>
                        <div className="sm:hidden flex items-center">
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                        {menuItems.map(({ label, path }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === path
                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
