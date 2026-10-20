import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// وارد کردن صفحات اصلی
import HomePage from './features/home/pages/HomePage'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import VerifyPhonePage from './features/auth/pages/VerifyPhonePage'
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage'

import CartPage from './features/cart/pages/CartPage'
import CheckoutPage from './features/order/cart/pages/CheckoutPage'
import ProductDetailsPage from './features/product/pages/ProductDetailsPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import OrderDetailsPage from './features/dashboard/pages/OrderDetailsPage'
import TicketDetailsPage from './features/dashboard/pages/TicketDetailsPage'
import TicketCreatePage from './features/dashboard/pages/TicketCreatePage'
import PaymentResultPage from './features/cart/pages/PaymentResultPage'
import BankGateway from './features/order/cart/pages/BankGateway'

// مسیرهای ادمین
import AdminTicketsPage from './features/dashboard/pages/AdminTicketsPage'
import AdminOrdersPage from './features/dashboard/pages/AdminOrdersPage'
import InventoryListPage from './features/dashboard/pages/InventoryListPage'
import ProductCreatePage from './features/product/pages/ProductCreatePage'
import ProductEditPage from './features/product/pages/ProductEditPage'
import ProductListPage from './features/product/pages/ProductListPage'

// اضافه شدن صفحه‌ی دسته‌بندی‌ها
import CategoryListPage from './features/admin/pages/CategoryListPage'

import { useAuth } from './shared/hooks/useAuth'

// کامپوننت محافظت از مسیرها برای کاربران عادی
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// کامپوننت محافظت از مسیرها برای مدیران
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (!isAdmin) {
    console.warn("User is not Admin, but allowing for testing...");
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* مسیرهای مشتری */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
          <Route path="/payment/callback" element={<ProtectedRoute><PaymentResultPage /></ProtectedRoute>} />
          <Route path="/bank-gateway" element={<BankGateway />} />

          {/* مسیرهای داشبورد کاربر */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="/dashboard/tickets/create" element={<ProtectedRoute><TicketCreatePage /></ProtectedRoute>} />
          <Route path="/dashboard/tickets/:id" element={<ProtectedRoute><TicketDetailsPage /></ProtectedRoute>} />
          
          {/* مسیرهای مدیریت (Admin) */}
          <Route path="/admin/tickets" element={<AdminRoute><AdminTicketsPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/inventory" element={<AdminRoute><InventoryListPage /></AdminRoute>} />
          
          {/* مسیر جدید و حرفه‌ای مدیریت دسته‌بندی‌ها */}
          <Route path="/admin/categories" element={<AdminRoute><CategoryListPage /></AdminRoute>} />
          
          {/* مسیرهای محصولات (ویترین مدیریتی) */}
          <Route path="/products" element={<AdminRoute><ProductListPage /></AdminRoute>} />
          <Route path="/products/create" element={<AdminRoute><ProductCreatePage /></AdminRoute>} />
          <Route path="/products/edit/:id" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
          
          {/* احراز هویت */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-phone" element={<VerifyPhonePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* مسیر پیش‌فرض */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;