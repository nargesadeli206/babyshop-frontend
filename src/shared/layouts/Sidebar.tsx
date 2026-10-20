import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  CubeIcon, 
  TagIcon, 
  ShoppingCartIcon,
  TruckIcon,
  CreditCardIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/', icon: HomeIcon, label: 'داشبورد' },
    { path: '/products', icon: CubeIcon, label: 'محصولات' },
    { path: '/categories', icon: TagIcon, label: 'دسته‌بندی‌ها' },
    { path: '/orders', icon: ShoppingCartIcon, label: 'سفارشات' },
    { path: '/inventory', icon: ArchiveBoxIcon, label: 'انبارداری' },
    { path: '/deliveries', icon: TruckIcon, label: 'حمل و نقل' },
    { path: '/payments', icon: CreditCardIcon, label: 'پرداخت‌ها' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-600">BabyShop</h1>
        <p className="text-sm text-gray-500">سیستم مدیریت</p>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 ml-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;