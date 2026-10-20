import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 mr-64">
        <Header />
        <main className="pt-20 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;