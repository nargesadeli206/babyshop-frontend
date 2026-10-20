import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../../../shared/hooks/useTickets';

const TicketDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTicketDetails, sendReply, loading } = useTickets();
  const [ticket, setTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  
  // این رفرنس برای اینه که هروقت پیام جدیدی اومد، اسکرول خودکار بره پایین
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    const data = await getTicketDetails(Number(id));
    setTicket(data);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    // اسکرول نرم به آخرین پیام
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket]);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    const result = await sendReply(Number(id), replyMessage);
    if (result.success) {
      setReplyMessage('');
      loadData(); 
    } else {
      alert("خطا در ارسال پیام!");
    }
  };

  // هندل کردن دکمه Enter برای ارسال پیام
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  if (!ticket && loading) return <div className="min-h-screen flex items-center justify-center p-20 text-center text-pink-500 font-bold animate-pulse text-xl">در حال لود گفتگو... 🍭</div>;
  if (!ticket) return <div className="min-h-screen flex items-center justify-center p-20 text-center text-red-500 font-bold text-xl">گفتگو پیدا نشد! 🎈</div>;

  return (
    <div className="min-h-screen bg-[#FFF9F9] p-4 md:p-8 text-right font-sans" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-pink-100 flex flex-col h-[85vh]">
        
        {/* هدر گفتگو */}
        <header className="p-6 bg-pink-500 text-white flex justify-between items-center shadow-lg z-10 relative">
           <button onClick={() => navigate('/dashboard')} className="bg-white/20 px-4 py-2 rounded-full font-bold hover:bg-white/30 transition-all text-sm">← برگشت</button>
           <div className="text-center">
              <h2 className="font-black text-lg">{ticket.subject}</h2>
              <span className="text-[10px] opacity-80 font-mono tracking-widest">تیکت #{ticket.ticketNumber}</span>
           </div>
           {/* نمایش وضعیت تیکت در هدر */}
           <div className={`text-[10px] font-black px-3 py-1 rounded-full ${ticket.status === 'Closed' ? 'bg-gray-100 text-gray-500' : 'bg-white/20'}`}>
              {ticket.status === 'Open' ? 'پاسخ نداده' : ticket.status === 'Closed' ? 'بسته شده' : 'در حال بررسی'}
           </div>
        </header>

        {/* بخش پیام‌ها (چت‌روم) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-pink-50/20 shadow-inner custom-scrollbar">
          
          {/* لیست پاسخ‌ها (پیام اصلی کاربر هم تو همین لیسته) */}
          {ticket.replies?.map((reply: any) => (
            <div key={reply.id} className={`flex flex-col ${reply.isAdminReply ? 'items-start' : 'items-end'}`}>
               <div className={`p-5 rounded-[2rem] shadow-sm max-w-[85%] relative 
                 ${reply.isAdminReply ? 'bg-blue-500 text-white rounded-tl-none shadow-blue-200' : 'bg-white text-gray-700 rounded-tr-none border border-pink-100 shadow-pink-100'}`}
               >
                  <div className="text-[10px] font-black mb-2 opacity-80 border-b border-white/20 pb-1 w-max">
                    {reply.isAdminReply ? '🧸 پشتیبانی زی‌زی' : 'شما'}
                  </div>
                  <p className="leading-loose whitespace-pre-wrap">{reply.message}</p>
                  <div className="flex justify-end mt-2">
                    <span className="text-[9px] opacity-60 font-mono">
                      {new Date(reply.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {/* آیکون روی پیام */}
                  {reply.isAdminReply 
                    ? <div className="absolute -top-3 -left-3 text-2xl bg-white rounded-full p-1 shadow-sm">🎧</div>
                    : <div className="absolute -top-3 -right-3 text-2xl bg-pink-50 rounded-full p-1 shadow-sm">👤</div>
                  }
               </div>
            </div>
          ))}
          {/* این دیو برای اینه که اسکرول همیشه بیاد روی آخرین پیام */}
          <div ref={messagesEndRef} />
        </div>

        {/* کادر تایپ پیام جدید (اگر بسته نشده باشه) */}
        {ticket.status !== 'Closed' ? (
          <div className="p-6 bg-white border-t-2 border-pink-50 flex gap-3 items-end">
             <textarea 
               rows={1}
               value={replyMessage} 
               onChange={e => setReplyMessage(e.target.value)} 
               onKeyDown={handleKeyDown}
               placeholder="پاسخ خود را اینجا بنویسید... (Enter برای ارسال)" 
               className="flex-1 p-4 rounded-3xl bg-gray-50 border-2 border-pink-50 focus:border-pink-400 outline-none transition-all resize-none min-h-[60px]"
             />
             <button 
               onClick={handleSendReply}
               disabled={!replyMessage.trim()}
               className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all text-xl mb-1
                 ${!replyMessage.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600 active:scale-90 shadow-pink-200'}`}
             >
               🚀
             </button>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 border-t-2 border-gray-100 text-center text-gray-500 text-sm font-bold">
            این گفتگو بسته شده است. 🔒
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsPage;