import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ phoneNumber, password });
  };

  const isNotVerified = error?.includes('تأیید نشده');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-lavender-50 p-4 text-right">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border-4 border-pink-100">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center text-5xl animate-bounce">🧸</div>
        </div>
        <h1 className="text-center font-bold text-3xl text-pink-500 mb-2">ziizii_kids</h1>
        <p className="text-center text-gray-400 mb-8 font-medium">خوشحالیم دوباره می‌بینیمت!</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm rounded-2xl p-3 mb-4 text-center border border-red-100">
            {error}
            {isNotVerified && (
              <button 
                type="button"
                onClick={() => navigate('/verify-phone', { state: { phoneNumber } })} 
                className="block w-full mt-2 font-bold text-pink-600 underline"
              >
                تایید شماره موبایل
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="شماره موبایل" 
            required 
            className="w-full px-5 py-3 rounded-2xl border border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50/30 text-right" 
            dir="ltr" 
          />
          
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="رمز عبور" 
              required 
              className="w-full px-5 py-3 rounded-2xl border border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50/30" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          <div className="text-left px-2">
            <Link to="/forgot-password" className="text-pink-400 text-sm hover:underline">فراموشی رمز عبور؟</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'در حال ورود...' : '🧸 ورود'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          هنوز عضو نیستی؟ <Link to="/register" className="text-pink-500 font-bold hover:underline">ثبت‌نام کن</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;