import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../order/hooks/useOrders';
import { Truck, Copy, CheckCircle2 } from 'lucide-react';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderDetails, getDeliveryDetails, loading } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [fetchError, setFetchError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const orderId = Number(id);
      
      try {
        const orderData = await getOrderDetails(orderId);
        if (orderData) {
            setOrder(orderData);
            
            // اینجا کلمه‌ی Shipped رو به صورت غیرحساس به حروف چک می‌کنیم
            if (orderData.status && orderData.status.toLowerCase() === 'shipped') {
              const deliveryData = await getDeliveryDetails(orderId);
              setDelivery(deliveryData);
            }
        } else {
            setFetchError("بک‌اند برای این آیدی دیتایی برنگرداند یا دسترسی ندارید.");
        }
      } catch (err) {
          setFetchError(err);
      }
    };
    fetchData();
  }, [id]);

  const copyTrackingNumber = () => {
    if (delivery?.trackingNumber) {
      navigator.clipboard.writeText(delivery.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const translateStatus = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'paid': return 'پرداخت شده ✅';
      case 'shipped': return 'ارسال شده 🚚';
      case 'cancelled': return 'لغو شده ❌';
      case 'delivered': return 'تحویل داده شده 🎁';
      default: return 'در انتظار تایید 📦';
    }
  };

  if (loading && !order) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F9]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-pink-500 font-bold">در حال آماده‌سازی فاکتور... 🍭</p>
      </div>
    </div>
  );

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500 font-bold text-xl">
        <p className="mb-2">سفارش پیدا نشد! 🎈</p>
        <p className="text-sm text-gray-500 font-normal max-w-md text-center leading-loose">
          ممکن است این سفارش متعلق به کاربر دیگری باشد یا بک‌اِند دیتایی برنگردانده است.
        </p>
        <button 
          onClick={() => {
              console.log("Current URL ID is:", id);
              console.log("Error details:", fetchError);
              alert("لطفاً دکمه F12 را بزنید و تب Console را چک کنید!");
          }}
          className="mt-6 px-6 py-3 bg-pink-100 text-pink-600 rounded-2xl text-sm hover:scale-105 transition-all shadow-md"
        >
          🔍 کلیک کنید تا علت ارور در کنسول چاپ شود
        </button>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-sm text-pink-400 hover:underline">
          بازگشت به داشبورد
        </button>
      </div>
    );
  }

  const orderItems = order.items || [];

  return (
    <div className="min-h-screen bg-[#FFF9F9] p-4 md:p-8 text-right font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border-b-4 border-pink-100">
          <button onClick={() => navigate('/dashboard')} className="text-pink-500 font-bold hover:scale-105 transition-all">← بازگشت</button>
          <h1 className="text-2xl font-black text-gray-800">فاکتور سفارش <span className="text-pink-500">#{order.orderNumber}</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* 
                باکس اطلاعات پستی 
                اینجا هم وضعیت رو چک کردیم که اگر حروف کوچیک هم بود کار کنه
            */}
            {order.status?.toLowerCase() === 'shipped' && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-[3rem] shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20"><Truck size={120} /></div>
                <div className="relative z-10">
                  <h3 className="font-black text-2xl mb-2">بسته‌ی شما ارسال شد! 🎉</h3>
                  
                  {/* اگر دلیوری هنوز لود نشده بود بهش میگیم در حال دریافت... */}
                  {!delivery ? (
                    <p className="text-blue-100 mb-6 font-bold animate-pulse">در حال دریافت اطلاعات پستی...</p>
                  ) : (
                    <>
                      <p className="text-blue-100 mb-6">سفارش شما تحویل <span className="font-bold text-white">{delivery.carrier || 'اداره پست'}</span> گردید.</p>
                      
                      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/30">
                        <div>
                          <div className="text-xs text-blue-100 mb-1">کد رهگیری / بارنامه:</div>
                          <div className="font-mono text-xl font-bold tracking-widest">{delivery.trackingNumber || 'ثبت نشده'}</div>
                        </div>
                        <button 
                          onClick={copyTrackingNumber} 
                          className="bg-white text-blue-600 p-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 font-bold text-sm"
                        >
                          {copied ? <><CheckCircle2 size={18}/> کپی شد</> : <><Copy size={18}/> کپی کد</>}
                        </button>
                      </div>
                      <p className="text-[10px] text-blue-100 mt-3 text-center">شما می‌توانید با استفاده از این کد، وضعیت بسته خود را از سایت شرکت پست پیگیری کنید.</p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-pink-50">
              <h3 className="font-black text-gray-700 mb-8 pr-4 border-r-4 border-pink-500 text-xl">🛍️ اقلام خریداری شده</h3>
              <div className="space-y-5">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-6 bg-pink-50/20 rounded-[2rem] border border-pink-50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                       <span className="text-3xl animate-bounce">🧸</span>
                       <div>
                          <div className="font-black text-gray-800 text-lg">{item.productName}</div>
                          <div className="text-gray-400 text-sm">تعداد: {item.quantity} عدد</div>
                       </div>
                    </div>
                    <div className="text-left font-black text-pink-600 text-xl">
                      {(item.unitPrice * item.quantity).toLocaleString()} <span className="text-[10px] font-normal">تومان</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[3rem] shadow-md border-2 border-blue-50">
              <h3 className="font-bold text-blue-600 mb-4 text-lg">📍 آدرس تحویل</h3>
              <p className="text-gray-700 leading-loose font-medium text-sm">{order.shippingAddress}</p>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-md border-2 border-orange-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-orange-400"></div>
              <h3 className="font-bold text-orange-500 mb-4 text-lg">📝 توضیحات سفارش</h3>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                {order.customerNote || "توضیحات خاصی برای این سفارش ثبت نشده است. ✨"}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-pink-100">
               <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 text-sm"><span>جمع اقلام:</span> <span>{order.subTotal?.toLocaleString()}</span></div>
                  
                  {/* نمایش هزینه‌ها به صورت داینامیک */}
                  {order.shippingCost > 0 && <div className="flex justify-between text-gray-500 text-sm"><span>هزینه ارسال:</span> <span>{order.shippingCost?.toLocaleString()}</span></div>}
                  {order.tax > 0 && <div className="flex justify-between text-gray-500 text-sm"><span>مالیات:</span> <span>{order.tax?.toLocaleString()}</span></div>}

                  <div className="pt-6 border-t-2 border-dashed border-pink-100 flex justify-between items-center text-xl font-black text-pink-600">
                    <span>مبلغ نهایی:</span>
                    <span>{order.totalAmount?.toLocaleString()} تومان</span>
                  </div>
               </div>
               <div className={`text-center py-3 rounded-2xl font-black text-sm ${order.status?.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                 وضعیت: {translateStatus(order.status)}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;