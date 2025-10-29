'use client'
import React from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">Bookstore</h1>
      {pathname === '/books' && (
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
