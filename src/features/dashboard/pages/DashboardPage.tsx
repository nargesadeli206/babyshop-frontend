import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useWishlist } from '../../../shared/context/WishlistContext';
import { useOrders } from '../../order/hooks/useOrders';
import { useTickets } from '../../../shared/hooks/useTickets'; 
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { logout, isAdmin, user } = useAuth(); // دریافت اطلاعات واقعی کاربر و نقش ادمین
  const { wishlist } = useWishlist();
  const { getMyOrders } = useOrders();
  const { getMyTickets, getAllTicketsAdmin } = useTickets();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [adminTickets, setAdminTickets] = useState<any[]>([]); // برای نوتیفیکیشن ادمین
  const [isLoading, setIsLoading] = useState(false);

  // لود کردن اطلاعات بر اساس تب فعال
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'orders') {
          const data = await getMyOrders();
          setOrders(data || []);
        } else if (activeTab === 'tickets') {
          const data = await getMyTickets();
          setTickets(data || []);
        }
      } catch (err) {
        console.error("خطا در بارگذاری دیتای داشبورد", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  // لود کردن پیام‌های باز برای نوتیفیکیشن منوی ادمین
  useEffect(() => {
    if (isAdmin) {
      const fetchAdminNotifs = async () => {
        const data = await getAllTicketsAdmin();
        setAdminTickets(data || []);
      };
      fetchAdminNotifs();
    }
  }, [isAdmin]);

  // ترجمه وضعیت تیکت به فارسی برای مشتری
  const translateTicketStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'در انتظار پاسخ ⏳';
      case 'inprogress': return 'پاسخ داده شده 💬';
      case 'resolved':
      case 'closed': return 'بسته شده 🔒';
      default: return status;
    }
  };

  // رنگ‌بندی وضعیت تیکت برای مشتری
  const getTicketStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-orange-100 text-orange-600'; // کاربر پیام داده، منتظر جوابه
      case 'inprogress': return 'bg-green-100 text-green-600'; // ادمین جواب داده
      case 'resolved':
      case 'closed': return 'bg-gray-100 text-gray-500';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  // محاسبه تعداد پیام‌های جدید (Open) برای نوتیفیکیشن ادمین
  const unreadAdminTicketsCount = adminTickets.filter(t => t.status === 'Open').length;
  
  // محاسبه پیام‌های پاسخ داده شده (InProgress) برای نوتیفیکیشن مشتری
  const unreadUserTicketsCount = tickets.filter(t => t.status === 'InProgress').length;

  return (
    <div className="min-h-screen bg-[#FFF9F9] font-sans p-4 md:p-8 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* هدر بالایی پنل */}
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border-b-4 border-pink-100">
           <Link to="/" className="text-pink-500 font-bold hover:scale-105 transition-all flex items-center gap-2">
             <span>←</span> بازگشت به فروشگاه
           </Link>
           <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3">
             حساب کاربری من <span className="text-4xl">🧸</span>
           </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* ستون منوی سمت راست (Sidebar) */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-[3rem] shadow-md border-2 border-pink-50 text-center relative overflow-hidden group">
               <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-white shadow-lg animate-bounce">👤</div>
               {/* نمایش اطلاعات واقعی استخراج شده از توکن */}
               <h3 className="font-black text-gray-700">{user?.fullName || "کاربر عزیز زی‌زی"}</h3>
               <p className="text-gray-400 text-xs mt-2 font-bold" dir="ltr">{user?.phoneNumber}</p>
               {isAdmin && <span className="inline-block mt-2 bg-blue-100 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase shadow-sm">مدیر سیستم 🛡️</span>}
               <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 rounded-full -mr-8 -mt-8"></div>
            </div>

            <nav className="bg-white rounded-[3rem] shadow-md overflow-hidden p-2 border-2 border-pink-50">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full p-5 text-right rounded-3xl mb-2 transition-all flex items-center justify-between ${activeTab === 'orders' ? 'bg-pink-500 text-white font-black shadow-lg shadow-pink-200' : 'text-gray-500 hover:bg-pink-50'}`}
              >
                <span>📦 سفارش‌های من</span>
                {activeTab === 'orders' && <span className="text-xs">●</span>}
              </button>
              
              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`w-full p-5 text-right rounded-3xl mb-2 transition-all flex items-center justify-between ${activeTab === 'wishlist' ? 'bg-pink-500 text-white font-black shadow-lg shadow-pink-200' : 'text-gray-500 hover:bg-pink-50'}`}
              >
                <span>💖 علاقه‌مندی‌ها</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'wishlist' ? 'bg-white text-pink-500' : 'bg-pink-50 text-pink-400'}`}>
                   {wishlist.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('tickets')}
                className={`w-full p-5 text-right rounded-3xl mb-2 transition-all flex items-center justify-between ${activeTab === 'tickets' ? 'bg-pink-500 text-white font-black shadow-lg shadow-pink-200' : 'text-gray-500 hover:bg-pink-50'}`}
              >
                <div className="flex items-center gap-2">
                  <span>✉️ پشتیبانی زی‌زی</span>
                  {/* نوتیفیکیشن پیام پاسخ داده شده برای مشتری */}
                  {!isAdmin && unreadUserTicketsCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
                      {unreadUserTicketsCount}
                    </span>
                  )}
                </div>
                {activeTab === 'tickets' && <span className="text-xs">●</span>}
              </button>

              {/* پنل ادمین - فقط برای مدیر نمایش داده می‌شود 🔒 */}
              {isAdmin && (
                <div className="mt-4 pt-4 border-t-2 border-gray-50 space-y-2">
                   <p className="text-[10px] text-gray-300 pr-5 font-bold mb-1">بخش مدیریت سیستم</p>
                   <button onClick={() => navigate('/admin/orders')} className="w-full p-5 text-right rounded-3xl text-blue-600 hover:bg-blue-50 font-black transition-all flex items-center gap-2">🛒 مدیریت سفارشات</button>
                   
                   <button onClick={() => navigate('/admin/tickets')} className="w-full p-5 text-right rounded-3xl text-blue-600 hover:bg-blue-50 font-black transition-all flex items-center justify-between">
                     <div className="flex items-center gap-2">🎧 مدیریت پیام‌ها</div>
                     {/* نوتیفیکیشن پیام جدید برای ادمین */}
                     {unreadAdminTicketsCount > 0 && (
                       <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-md">
                         {unreadAdminTicketsCount}
                       </span>
                     )}
                   </button>
                   
                   <button onClick={() => navigate('/admin/inventory')} className="w-full p-5 text-right rounded-3xl text-blue-600 hover:bg-blue-50 font-black transition-all flex items-center gap-2">📦 موجودی انبار</button>
                   <button onClick={() => navigate('/admin/categories')} className="w-full p-5 text-right rounded-3xl text-blue-600 hover:bg-blue-50 font-black transition-all flex items-center gap-2">🏷️ مدیریت دسته‌بندی‌ها</button>
                   <button onClick={() => navigate('/products')} className="w-full p-5 text-right rounded-3xl text-blue-600 hover:bg-blue-50 font-black transition-all flex items-center gap-2">🛍️ لیست ویترین</button>
                </div>
              )}

              <button onClick={logout} className="w-full p-5 text-right text-red-500 font-bold hover:bg-red-50 rounded-3xl mt-4 transition-all flex items-center gap-2">
                 🚪 خروج از حساب
              </button>
            </nav>
          </div>

          {/* ستون محتوای اصلی */}
          <div className="md:col-span-3">
            <div className="bg-white p-10 rounded-[4rem] shadow-xl border-4 border-pink-100 min-h-[600px]">
               
               {activeTab === 'orders' && (
                 <>
                   <h2 className="text-2xl font-black text-gray-800 mb-8 border-r-8 border-pink-500 pr-4">لیست سفارشات اخیر</h2>
                   {isLoading ? (
                     <div className="text-center py-20 text-pink-400 font-bold animate-pulse text-xl">در حال خواندن اطلاعات... 🍭</div>
                   ) : orders.length === 0 ? (
                     <div className="text-center py-24 text-gray-400 italic bg-pink-50/20 rounded-[3rem] border-2 border-dashed border-pink-100">هنوز هیچ سفارشی ثبت نکردی! 🎈</div>
                   ) : (
                     <div className="grid gap-4">
                        {orders.map((order: any) => (
                          <div key={order.id} onClick={() => navigate(`/dashboard/order/${order.id}`)} className="bg-white p-6 rounded-[2.5rem] border-2 border-pink-50 flex justify-between items-center hover:border-pink-300 hover:shadow-lg cursor-pointer transition-all group">
                             <div>
                               <div className="font-black text-gray-700 text-lg group-hover:text-pink-500">سفارش #{order.orderNumber}</div>
                               <div className="text-gray-400 text-[10px] mt-1 italic">تاریخ ثبت: {new Date(order.createdAt).toLocaleDateString('fa-IR')}</div>
                             </div>
                             <div className="text-left">
                               <div className="text-pink-500 font-black text-xl">{order.totalAmount?.toLocaleString()} تومان</div>
                               <div className="bg-pink-50 text-pink-400 px-4 py-1 rounded-full text-[10px] font-black mt-2 inline-block shadow-inner">وضعیت: {order.status === 'Pending' ? 'در انتظار ⏳' : order.status === 'Shipped' ? 'ارسال شده 🚚' : order.status === 'Paid' ? 'پرداخت شده ✅' : order.status}</div>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                 </>
               )}

               {activeTab === 'wishlist' && (
                 <>
                    <h2 className="text-2xl font-black text-gray-800 mb-8 border-r-8 border-pink-500 pr-4">لباس‌های مورد علاقه من</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {wishlist.map((item: any) => (
                          <div key={item.id} className="bg-white p-4 rounded-[2rem] border-2 border-pink-50 flex items-center gap-4 hover:shadow-lg transition-all border-dashed">
                             <img src={item.imageUrl ? `https://localhost:7168${item.imageUrl}` : 'https://placehold.co/200x200/FFD1DC/white?text=👗'} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
                             <div className="flex-1">
                               <h4 className="font-bold text-gray-700 text-sm">{item.name}</h4>
                               <p className="text-pink-500 font-black text-sm mt-1">{item.price?.toLocaleString()} تومان</p>
                             </div>
                             <button onClick={() => navigate(`/product/${item.id}`)} className="bg-pink-50 text-pink-500 w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all shadow-sm">👁️</button>
                          </div>
                        ))}
                        {wishlist.length === 0 && <p className="col-span-full text-center py-24 text-gray-400 italic">لیست علاقه‌مندی‌ها خالی است 💔</p>}
                    </div>
                 </>
               )}

               {activeTab === 'tickets' && (
                 <>
                   <div className="flex justify-between items-center mb-10">
                     <h2 className="text-2xl font-black text-gray-800 border-r-8 border-pink-500 pr-4">تیکت‌های پشتیبانی</h2>
                     <button onClick={() => navigate('/dashboard/tickets/create')} className="bg-pink-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-pink-600 transition-all flex items-center gap-2 shadow-pink-100 active:scale-95"><span>📨</span> پیام جدید</button>
                   </div>
                   {isLoading ? <div className="text-center py-20 text-pink-400 font-bold animate-pulse">در حال لود گفتگوها...</div> : (
                     <div className="space-y-4">
                        {tickets.map((ticket: any) => (
                          <div key={ticket.id} onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)} className="bg-white p-6 rounded-[2.5rem] border-2 border-pink-50 flex justify-between items-center hover:border-pink-300 hover:shadow-lg cursor-pointer transition-all">
                             <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${ticket.status === 'Open' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
                                  {ticket.status === 'Open' ? '⏳' : '💬'}
                                </div>
                                <div>
                                  <div className="font-black text-gray-700">{ticket.subject}</div>
                                  <div className="text-gray-400 text-[10px] mt-1 font-mono">تیکت #{ticket.ticketNumber}</div>
                                </div>
                             </div>
                             {/* نمایش لیبل ترجمه شده و رنگ‌بندی شده */}
                             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black shadow-inner ${getTicketStatusColor(ticket.status)}`}>
                               {translateTicketStatus(ticket.status)}
                             </div>
                          </div>
                        ))}
                        {tickets.length === 0 && <p className="text-center py-24 text-gray-400 italic">پیامی برای نمایش وجود ندارد ✨</p>}
                     </div>
                   )}
                 </>
               )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 text-center text-gray-300 text-[10px] pb-10">
        پنل کاربری اختصاصی زی‌زی کیدز 🧸 تمامی حقوق محفوظ است
      </footer>
    </div>
  );
};

export default DashboardPage;