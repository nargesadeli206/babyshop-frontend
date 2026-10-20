import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../../../shared/hooks/useTickets';
import { Send, ArrowRight, AlertCircle } from 'lucide-react';

const TicketCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createTicket, loading } = useTickets();
  const [formData, setFormData] = useState({ subject: '', message: '', category: 'General' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // ارسال دیتا دقیقاً طبق مدل بک‌اند (CreateTicketDto)
    const payload = {
      Subject: formData.subject,
      Message: formData.message,
      Category: formData.category,
      OrderId: null,
      ProductId: null
    };

    const result = await createTicket(payload);
    
    // اگر بک‌اند با موفقیت ثبت کرد (result.success باید بررسی بشه، چون تو useTickets ممکنه فقط خود آبجکت برگرده)
    if (result && (result.success || result.id || result.Id)) {
      alert('تیکت شما با موفقیت ثبت شد! 🧸');
      // برمی‌گردونیمش به همون تب تیکت‌ها تو داشبورد
      navigate('/dashboard');
    } else {
      setErrorMsg("متاسفانه در ثبت پیام مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] p-4 md:p-12 text-right font-sans" dir="rtl">
      <div className="max-w-2xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-all font-bold">
          <ArrowRight size={20} /> انصراف و بازگشت
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl p-10 border-4 border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
          
          <h1 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2 relative z-10">
            <span className="bg-pink-100 p-2 rounded-2xl text-pink-500"><Send size={24} /></span> 
            ارسال پیام جدید به پشتیبانی
          </h1>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2">
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block">موضوع پیام شما</label>
              <input 
                type="text" 
                placeholder="مثلاً: سوال در مورد سایز لباس" 
                required 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})} 
                className="w-full p-4 rounded-[1.5rem] bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300 font-bold text-gray-700" 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block">دسته‌بندی پیام</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className="w-full p-4 rounded-[1.5rem] bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300 font-bold text-gray-700 appearance-none"
              >
                 <option value="General">سوال عمومی</option>
                 <option value="Order">پیگیری سفارش</option>
                 <option value="Technical">مشکل فنی در سایت</option>
                 <option value="Suggestion">انتقاد یا پیشنهاد</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block">شرح پیام</label>
              <textarea 
                placeholder="سلام، من می‌خواستم بدونم که..." 
                required 
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
                className="w-full p-4 rounded-[1.5rem] bg-gray-50 outline-none focus:ring-2 focus:ring-pink-300 font-bold text-gray-700 leading-relaxed" 
                rows={5}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full text-white py-5 rounded-[2rem] font-black text-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${loading ? 'bg-gray-300' : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200'}`}
            >
              {loading ? 'در حال ارسال پیام... 📨' : <>🧸 تایید و ارسال پیام</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketCreatePage;