import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register({ fullName, phoneNumber, email, password, confirmPassword });
    if (result.success) {
      navigate('/verify-phone', { state: { phoneNumber } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-lavender-50 p-4 text-right">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border-4 border-pink-100">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center text-5xl">🧸</div>
        </div>
        <h1 className="text-center font-bold text-3xl text-pink-500 mb-6">ثبت‌نام</h1>
        {error && <div className="bg-red-50 text-red-500 text-sm p-3 mb-4 rounded-xl text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="نام و نام خانوادگی" required className="w-full px-5 py-3 rounded-2xl border border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50/30" />
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="شماره موبایل" required className="w-full px-5 py-3 rounded-2xl border border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50/30 text-right" dir="ltr" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل (اختیاری)" className="w-full px-5 py-3 rounded-2xl border border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50/30 text-right" dir="ltr" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور" required className="w-full px-5 py-3 rounded-2xl border border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50/30" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="تکرار رمز عبور" required className="w-full px-5 py-3 rounded-2xl border border-pink-100 focus:border-pink-400 focus:outline-none bg-pink-50/30" />
          <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg">
            {loading ? 'در حال ثبت‌نام...' : '🧸 ثبت‌نام'}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">قبلاً عضو شدی؟ <Link to="/login" className="text-pink-500 font-bold hover:underline">وارد شو</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;