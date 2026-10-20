import { useState } from 'react';
import { environment } from '../../../shared/config/environment';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تابع کمکی برای گرفتن توکن
  const getToken = () => localStorage.getItem('token');

  // ۱. ثبت سفارش جدید (با سیستم هوشمند تشخیص خطا)
  const createOrder = async (orderData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || JSON.stringify(result.errors) || 'خطای نامشخص از سمت سرور';
        alert(`دلیل ارور بک‌اند:\n${errorMessage}`);
        throw new Error(errorMessage);
      }
      
      return { success: true, data: result.data };
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
         alert('سرور خاموش است یا خطای CORS وجود دارد.');
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ۲. دریافت لیست کل سفارشات (مخصوص ادمین)
  const getAllOrdersAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Order`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${getToken()}` 
        }
      });
      
      if (!response.ok) return [];
      
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ۳. تغییر وضعیت سفارش (توسط ادمین)
  const updateStatus = async (orderId: number, status: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Order/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ OrderId: orderId, Status: status }),
      });
      
      if (!response.ok) throw new Error('خطا در آپدیت');
      
      const result = await response.json();
      return { success: true, message: result.message };
    } catch (err) {
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ۴. گرفتن لیست سفارش‌های من (مخصوص کاربر)
  const getMyOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Order/my`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${getToken()}` 
        }
      });
      
      if (!response.ok) return [];
      
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ۵. گرفتن جزئیات یک سفارش خاص (برای فاکتور)
  const getOrderDetails = async (orderId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Order/${orderId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${getToken()}` 
        }
      });
      
      if (!response.ok) return null;
      
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ۶. گرفتن اطلاعات دلیوری (کد رهگیری پستی) یک سفارش
  const getDeliveryDetails = async (orderId: number) => {
    try {
      const response = await fetch(`${environment.apiUrl}/Delivery/order/${orderId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!response.ok) return null;
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      return null;
    }
  };

  // بازگرداندن تمام توابع به کامپوننت‌ها
  return { 
    createOrder, 
    getAllOrdersAdmin, 
    updateStatus, 
    getMyOrders, 
    getOrderDetails, 
    getDeliveryDetails, 
    loading, 
    error 
  };
};