import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../../shared/layouts/MainLayout';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';

// صفحات موقت
const ProductsPage: React.FC = () => <div className="p-8 text-center">صفحه محصولات</div>;
const CategoriesPage: React.FC = () => <div className="p-8 text-center">صفحه دسته‌بندی‌ها</div>;
const OrdersPage: React.FC = () => <div className="p-8 text-center">صفحه سفارشات</div>;
const InventoryPage: React.FC = () => <div className="p-8 text-center">صفحه انبارداری</div>;
const DeliveriesPage: React.FC = () => <div className="p-8 text-center">صفحه حمل و نقل</div>;
const PaymentsPage: React.FC = () => <div className="p-8 text-center">صفحه پرداخت‌ها</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'deliveries', element: <DeliveriesPage /> },
      { path: 'payments', element: <PaymentsPage /> },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;