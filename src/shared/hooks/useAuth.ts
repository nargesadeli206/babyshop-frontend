import { useState } from 'react';
import { environment } from '../config/environment';

// تابع کمکی برای استخراج اطلاعات و نقش از توکن JWT
const getAuthData = () => {
  const token = localStorage.getItem('token');
  if (!token) return { isAdmin: false, user: null };
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const payload = JSON.parse(jsonPayload);
    
    // شناسایی نقش (Role)
    const roles = payload["role"] || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const isAdmin = Array.isArray(roles) ? roles.includes("Admin") : roles === "Admin";
    
    // استخراج مشخصات یوزر
    return {
      isAdmin,
      user: {
        fullName: payload["unique_name"] || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "کاربر عزیز",
        phoneNumber: payload["mobilephone"] || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"] || ""
      }
    };
  } catch (e) {
    return { isAdmin: false, user: null };
  }
};

export const useAuth = () => {
  const authData = getAuthData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState<boolean>(authData.isAdmin);

  const login = async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      // این خط اصلاح شد (اضافه شدن پرانتز برای fetch)
      const response = await fetch(`${environment.apiUrl}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ PhoneNumber: payload.phoneNumber, Password: payload.password }),
      });

      // برای پروژه‌های واقعی: بررسی وضعیت‌های غیرموفق مثل ۴۰۱ یا ۵۰۰
      if (!response.ok) {
         if(response.status === 401) throw new Error('شماره موبایل یا رمز عبور اشتباه است.');
         throw new Error('خطا در ارتباط با سرور.');
      }

      const result = await response.json();
      
      // اگر ساختار دیتای بک‌اند شما توکن رو برمی‌گردونه
      if (result.success) {
        // توکن را پیدا می‌کنیم (ممکنه تو data باشه یا مستقیم تو response)
        const token = result.data?.accessToken || result.token || result.accessToken;
        if (token) {
          localStorage.setItem('token', token);
          setIsAuthenticated(true);
          
          const newAuthData = getAuthData();
          setIsAdmin(newAuthData.isAdmin);
          
          window.location.replace('/'); // انتقال به صفحه اصلی
          return { success: true };
        }
      }
      throw new Error(result.message || 'خطا در ورود');
    } catch (err: any) {
      // اگر خطای Failed to fetch گرفتیم (CORS یا خاموش بودن سرور)
      if (err.message === 'Failed to fetch') {
          setError('سرور پاسخ نمی‌دهد. اتصال اینترنت و سرور را بررسی کنید.');
      } else {
          setError(err.message);
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.replace('/login');
  };

  return { 
    login, 
    logout, 
    loading, 
    error, 
    isAuthenticated, 
    isAdmin, 
    user: authData.user 
  };
};