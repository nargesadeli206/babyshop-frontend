import { useState, useEffect } from 'react';
import { environment } from '../../../shared/config/environment';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  slug: string;
  currentStock: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ۱. تابع گرفتن کل محصولات
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Product`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      } else {
        throw new Error(result.message || 'خطا در دریافت لیست محصولات');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ۲. تابع جستجو 🔍
  const searchProducts = async (term: string) => {
    if (!term.trim()) {
      fetchProducts();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Product/search?term=${term}`);
      const result = await response.json();
      if (result.success) setProducts(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ۳. تابع فیلتر بر اساس جنسیت 👶 (بر اساس API شما)
  const filterByGender = async (genderId: number) => {
    if (genderId === 0) {
      fetchProducts();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Product/by-gender/${genderId}`);
      const result = await response.json();
      if (result.success) setProducts(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, searchProducts, filterByGender, refresh: fetchProducts };
};