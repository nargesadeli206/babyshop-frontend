import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, loading, error } = useAuth();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const phoneNumber = location.state?.phoneNumber || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { alert('رمزها یکی نیستند'); return; }
    const result = await resetPassword({ phoneNumber, code, newPassword, confirmPassword });
    if (result.success) {
      alert('رمز عبور با موفقیت عوض شد!');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-lavender-50 p-4 text-right">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border-4 border-pink-100 text-center">
        <h1 className="text-2xl font-bold text-pink-500 mb-6">تنظیم رمز جدید</h1>
        <div className="bg-pink-50 p-3 rounded-2xl mb-4 text-pink-400 font-bold">شماره: {phoneNumber}</div>
        {error && <div className="bg-red-50 text-red-500 text-sm p-3 mb-4 rounded-xl">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="کد تایید" required className="w-full px-5 py-3 rounded-2xl border border-pink-100 text-center" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="رمز جدید" required className="w-full px-5 py-3 rounded-2xl border border-pink-100" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="تکرار رمز جدید" required className="w-full px-5 py-3 rounded-2xl border border-pink-100" />
          <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg">🧸 تغییر رمز</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;