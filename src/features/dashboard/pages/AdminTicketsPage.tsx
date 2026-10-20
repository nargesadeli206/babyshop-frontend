import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTickets } from '../../../shared/hooks/useTickets';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AdminTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { getAllTicketsAdmin, loading } = useTickets();
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const data = await getAllTicketsAdmin();
      setTickets(data || []);
    };
    fetchAll();
  }, []);

  // متد کمکی برای ترجمه وضعیت به فارسی و تعیین رنگ
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1 w-max mx-auto shadow-sm animate-pulse"><AlertCircle size={14}/> جدید (پاسخ نداده)</span>;
      case 'inprogress':
        return <span className="bg-yellow-100 text-yellow-600 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1 w-max mx-auto"><Clock size={14}/> در حال بررسی</span>;
      case 'resolved':
      case 'closed':
        return <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1 w-max mx-auto"><CheckCircle size={14}/> بسته شده</span>;
      default:
        return <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-black">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] p-8 text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border-b-4 border-blue-400">
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <MessageSquare className="text-blue-500" size={32} /> مدیریت پیام‌های مشتریان
          </h1>
          <Link to="/dashboard" className="text-blue-500 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">← پنل کاربری</Link>
        </header>

        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border-4 border-white">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-blue-50/50 text-blue-800 text-sm border-b-2 border-blue-100">
                <th className="p-6 font-black">شماره تیکت</th>
                <th className="p-6 font-black">نام کاربر</th>
                <th className="p-6 font-black">موضوع</th>
                <th className="p-6 font-black text-center">وضعیت</th>
                <th className="p-6 font-black text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-blue-500 font-bold animate-pulse">در حال خواندن پیام‌ها... 📨</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-gray-400 italic font-medium">هیچ پیامی برای نمایش وجود ندارد. ✨</td></tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="p-6 font-mono font-bold text-gray-400 text-xs tracking-wider">{ticket.ticketNumber}</td>
                    <td className="p-6">
                      <div className="font-black text-gray-800 text-base">{ticket.userName || 'کاربر عزیز'}</div>
                      <div className="text-gray-400 text-xs font-mono mt-1">{ticket.userPhone}</div>
                    </td>
                    <td className="p-6 font-bold text-gray-700">{ticket.subject}</td>
                    <td className="p-6 text-center">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 mx-auto
                          ${ticket.status === 'Open' 
                            ? 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-1 shadow-red-200' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white'}`}
                      >
                        {ticket.status === 'Open' ? 'پاسخ فوری' : 'مشاهده پیام'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketsPage;