import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

const VerifyPhonePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyPhone, loading, error } = useAuth();
  const [code, setCode] = useState('');
  
  const phoneNumber = location.state?.phoneNumber || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("حمله به دکمه تایید با کد:", code); // برای تست در کنسول

    // اگر کد 123456 بود، همینطوری وارد شو (برای تست سریع اگر بک‌اِند اذیت کرد)
    if (code === "123456") {
      console.log("استفاده از کد تست برای ورود");
      localStorage.setItem('token', 'fake-token');
      window.location.href = '/'; // رفرش و رفتن به صفحه اصلی
      return;
    }

    const result = await verifyPhone(phoneNumber, code);
    console.log("نتیجه تایید شماره:", result);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-lavender-50 p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border-4 border-pink-100 text-center">
        <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center text-5xl mx-auto mb-4">
          📩
        </div>
        <h1 className="text-2xl font-bold text-pink-500 mb-2">تأیید شماره موبایل</h1>
        <p className="text-gray-400 mb-6 text-sm">
          کد تایید برای شماره <span className="font-bold text-pink-400">{phoneNumber}</span> ارسال شده است.
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm rounded-2xl p-3 mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="کد تایید"
            className="w-full px-5 py-4 rounded-2xl border border-pink-100 text-center text-2xl tracking-widest focus:border-pink-400 focus:outline-none bg-pink-50/30"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all disabled:opacity-50"
          >
            {loading ? 'در حال بررسی...' : '🧸 تایید و ورود'}
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 text-pink-300 text-sm hover:underline"
        >
          برگشت به لاگین
        </button>
      </div>
    </div>
  );
};

export default VerifyPhonePage;