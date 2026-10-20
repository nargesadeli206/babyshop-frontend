import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading, error } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await forgotPassword(phoneNumber);
    if (result.success) {
      setIsSent(true);
      // انتقال هوشمند: شماره موبایل رو هم به صفحه بعد می‌فرستیم تا کاربر راحت باشه
      setTimeout(() => {
        navigate('/reset-password', { state: { phoneNumber } });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-lavender-50 p-4 text-right">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border-4 border-pink-100">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center text-5xl animate-pulse">
            🔑
          </div>
        </div>
        
        <h1 className="text-center font-bold text-2xl text-pink-500 mb-2">فراموشی رمز عبور</h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          شماره موبایلت رو وارد کن تا کد بازیابی برات بفرستیم
        </p>

        {isSent ? (
          <div className="bg-green-50 text-green-600 rounded-2xl p-4 text-center border border-green-100 animate-bounce">
            ✨ کد بازیابی با موفقیت ارسال شد!
            <br />
            <span className="text-xs font-bold">در حال انتقال به صفحه تنظیم رمز جدید...</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-500 text-sm rounded-2xl p-3 mb-4 text-center border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-500 text-sm mb-2 px-2 text-right">شماره موبایل</label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="09123456789" 
                  required 
                  className="w-full px-5 py-4 rounded-2xl border border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50/30 text-center font-bold" 
                  dir="ltr" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'در حال ارسال...' : '🧸 ارسال کد تایید'}
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-8">
          <Link to="/login" className="text-pink-400 text-sm font-bold hover:underline">
            ← برگشت به صفحه ورود
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;