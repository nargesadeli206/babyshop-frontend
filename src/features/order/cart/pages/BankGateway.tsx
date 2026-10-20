import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const BankGateway: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const amount = searchParams.get('amount');

  // فیلدهای فرم
  const [card, setCard] = useState('');
  const [cvv2, setCvv2] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [otp, setOtp] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  // تولید کد کپچا تصادفی
  const generateCaptcha = () => {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    setCaptchaCode(code);
  };

  useEffect(() => { generateCaptcha(); }, []);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();

    // اعتبارسنجی‌های بیزنسی
    if (card.length !== 16) return alert('شماره کارت باید دقیقاً ۱۶ رقم باشد');
    if (cvv2.length < 3) return alert('کد CVV2 نامعتبر است');
    if (!month || !year) return alert('تاریخ انقضا را وارد کنید');
    if (captchaInput !== captchaCode) {
      alert('کد امنیتی اشتباه است');
      generateCaptcha();
      return;
    }
    if (!otp) return alert('لطفاً رمز پویا را وارد کنید');

    // انتقال به صفحه نتیجه
    alert('تراکنش با موفقیت در شبکه شاپرک تایید شد. ✨');
    window.location.href = `/payment/callback?paymentId=${paymentId}&status=OK`;
  };

  return (
    <div className="min-h-screen bg-[#e1e1e1] flex items-center justify-center font-sans p-4" dir="rtl">
      <div className="bg-white shadow-2xl w-full max-w-2xl border-t-8 border-green-600 rounded-b-3xl overflow-hidden">
        
        {/* هدر شاپرک */}
        <header className="p-4 border-b flex justify-between items-center bg-gray-50">
           <img src="https://shaparak.ir/templates/shaparak/images/logo.png" alt="shaparak" className="h-10" />
           <div className="text-left text-[10px] text-gray-400">
              درگاه پرداخت اینترنتی به پرداخت ملت <br/> شماره ترمینال: ۸۸۳۴۷۱
           </div>
        </header>
        
        <div className="p-8">
           <div className="bg-blue-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-blue-100">
              <span className="text-blue-700 font-bold">مبلغ قابل پرداخت:</span>
              <span className="text-xl font-black text-blue-900">{Number(amount).toLocaleString()} تومان</span>
           </div>

           <form onSubmit={handlePay} className="space-y-5">
              {/* شماره کارت */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">شماره کارت</label>
                <input type="text" maxLength={16} required value={card} onChange={e => setCard(e.target.value)} className="w-full p-3 border-2 rounded-lg text-center text-xl tracking-[0.4rem] focus:border-blue-500 outline-none font-mono" placeholder="____ ____ ____ ____" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {/* CVV2 */}
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">CVV2</label>
                    <input type="password" maxLength={4} required value={cvv2} onChange={e => setCvv2(e.target.value)} className="w-full p-3 border-2 rounded-lg text-center outline-none focus:border-blue-500" />
                 </div>
                 {/* تاریخ انقضا */}
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">تاریخ انقضا</label>
                    <div className="flex gap-1">
                       <input type="text" placeholder="ماه" maxLength={2} required value={month} onChange={e => setMonth(e.target.value)} className="w-1/2 p-3 border-2 rounded-lg text-center outline-none focus:border-blue-500" />
                       <input type="text" placeholder="سال" maxLength={2} required value={year} onChange={e => setYear(e.target.value)} className="w-1/2 p-3 border-2 rounded-lg text-center outline-none focus:border-blue-500" />
                    </div>
                 </div>
              </div>

              {/* کد امنیتی (کپچا) 🤖 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">کد امنیتی</label>
                <div className="flex gap-2">
                   <input type="text" required value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} className="w-1/2 p-3 border-2 rounded-lg text-center text-lg font-bold outline-none focus:border-blue-500" />
                   <div className="w-1/2 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-gray-200 select-none">
                      <span className="text-2xl font-black italic tracking-widest text-gray-400 line-through decoration-pink-500">{captchaCode}</span>
                      <button type="button" onClick={generateCaptcha} className="absolute left-2 text-blue-500 font-bold">↻</button>
                   </div>
                </div>
              </div>

              {/* رمز پویا 📱 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">رمز دوم (پویا)</label>
                <div className="flex gap-2">
                   <input type="password" required value={otp} onChange={e => setOtp(e.target.value)} className="flex-1 p-3 border-2 rounded-lg text-center text-xl outline-none focus:border-blue-500" placeholder="******" />
                   <button type="button" onClick={() => alert('رمز پویا با پیامک ارسال شد (تستی)')} className="bg-gray-800 text-white px-4 rounded-lg text-[10px] font-bold">درخواست رمز پویا</button>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all">
                  پرداخت نهایی
                </button>
                <button type="button" onClick={() => window.location.href='/cart'} className="w-full text-gray-400 text-sm font-medium">انصراف و بازگشت</button>
              </div>
           </form>
        </div>
        
        <div className="p-4 bg-yellow-50 text-[9px] text-yellow-800 leading-relaxed border-t border-yellow-100">
           هشدار: این یک درگاه پرداخت تستی برای پروژه‌ی زی‌زی کیدز است. هرگز اطلاعات واقعی کارت بانکی خود را وارد نکنید.
        </div>
      </div>
    </div>
  );
};

export default BankGateway;