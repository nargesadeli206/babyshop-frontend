import { useState } from 'react';
import { environment } from '../config/environment';

export const useInventory = () => {
  const [loading, setLoading] = useState(false);
  const API_BASE = `${environment.apiUrl}/Inventory`;

  const getAllInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: any = { 'Content-Type': 'application/json' };
      
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // سینتکس درست برای fetch
      const response = await fetch(`${API_BASE}?t=${Date.now()}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) return [];

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Inventory Fetch Error:', error);
      return [];
    }
  };

  // اضافه شدن پارامتر ageRange به متد افزایش/کاهش (برای سازگاری با بک‌اِند هوشمند)
  const updateStock = async (productId: number, ageRange: string, quantity: number, type: 'increase' | 'decrease') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // اگر ageRange خالی یا نامعتبر بود، یه دیفالت می‌ذاریم که درخواست Fail نشه
      const safeAgeRange = (ageRange === 'default' || !ageRange) ? '0-3' : ageRange;

      // ساخت آدرس درست
      const url = `${API_BASE}/${type}?productId=${productId}&ageRange=${encodeURIComponent(safeAgeRange)}&quantity=${quantity}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });

      const result = await response.json();
      return { success: response.ok && (result.success !== false) };
    } catch (error) {
      console.error('Update Stock Error:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // متد جدید برای حذف یک رکورد انبار
  const deleteInventory = async (id: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // سینتکس درست
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      return { success: response.ok };
    } catch (error) {
      console.error('Delete Inventory Error:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { getAllInventory, updateStock, deleteInventory, loading };
};