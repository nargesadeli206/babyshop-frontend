import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            خوش آمدید، ادمین
          </h2>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <BellIcon className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center space-x-2 space-x-reverse">
            <UserCircleIcon className="w-8 h-8 text-gray-600" />
            <span className="text-sm text-gray-700">مدیر سیستم</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;