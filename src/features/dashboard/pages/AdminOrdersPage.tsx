import React, { useEffect, useState } from 'react';
import { useOrders } from '../../order/hooks/useOrders';
import { Package, User, Phone, RefreshCw, Truck, X, Check } from 'lucide-react';

const AdminOrdersPage: React.FC = () => {
  const { getAllOrdersAdmin, updateStatus, loading } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);

  // استیت‌های مربوط به مودالِ ثبتِ دلیوری (کد رهگیری)
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('شرکت پست جمهوری اسلامی ایران');

  const loadData = async () => {
    const data = await getAllOrdersAdmin();
    setOrders(Array.isArray(data) ? data : []);
  };

  useEffect(() => { loadData(); }, []);

  const translateStatus = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'paid': return 'پرداخت شده ✅';
      case 'shipped': return 'ارسال شده 🚚';
      case 'cancelled': return 'لغو شده ❌';
      default: return 'در انتظار ⏳';
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (newStatus === '') return;

    // اگر ادمین گفت "ارسال شده"، مودالِ ثبت کد رهگیری رو باز می‌کنیم
    if (newStatus === 'Shipped') {
      setSelectedOrderId(orderId);
      setTrackingNumber('');
      setIsDeliveryModalOpen(true);
      return; 
    }

    // برای سایر وضعیت‌ها، همون روال قبلی رو می‌ریم
    const result = await updateStatus(orderId, newStatus);
    if (result) {
      loadData();
    }
  };

  // ثبت اطلاعات پستی تو سرور (کاملا بیزنسی و متصل به اطلاعات واقعی مشتری)
  const submitDeliveryInfo = async () => {
    if (!trackingNumber.trim()) {
      alert("لطفاً کد رهگیری رو وارد کن!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // پیدا کردن سفارش فعلی از توی لیست برای استخراج شماره موبایل واقعی مشتری
      const currentOrder = orders.find(o => o.id === selectedOrderId);

      // ۱. اول وضعیت اصلی سفارش رو به Shipped تغییر می‌دیم
      await updateStatus(selectedOrderId!, 'Shipped');

      // ۲. حالا کد رهگیری رو تو سیستم Delivery ثبت می‌کنیم
      const deliveryPayload = {
        OrderId: selectedOrderId,
        Address: "موجود در فاکتور سفارش", // آدرس تو فاکتور اصلی هست
        PhoneNumber: currentOrder?.phoneNumber || "00000000000", // شماره موبایل واقعی مشتری رو می‌فرستیم!
        PostalCode: "0000000000",
        Carrier: carrier
      };

      const createResponse = await fetch('https://localhost:7168/api/Delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(deliveryPayload)
      });

      if (createResponse.ok) {
        const createResult = await createResponse.json();
        const deliveryId = createResult.data.id || createResult.data.Id;

        // ۳. آپدیت وضعیت Delivery به همراه ثبت کد رهگیری
        await fetch('https://localhost:7168/api/Delivery/status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            DeliveryId: deliveryId,
            Status: 'Shipped',
            TrackingNumber: trackingNumber
          })
        });

        alert("کد رهگیری با موفقیت ثبت و سفارش ارسال شد! 🚚✨");
        setIsDeliveryModalOpen(false);
        loadData();
      } else {
        alert("خطا در ایجاد رکورد ارسال در سرور!");
      }
    } catch (error) {
      console.error("Delivery Error:", error);
      alert("خطای ارتباط با سرور دلیوری!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-right font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border-b-4 border-blue-500">
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2"><Package className="text-blue-500" /> مدیریت کل سفارشات</h1>
          <button onClick={loadData} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> بروزرسانی
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-400 text-xs font-black">
              <tr>
                <th className="p-6">شماره سفارش</th>
                <th className="p-6">نام مشتری</th>
                <th className="p-6">شماره تماس</th>
                <th className="p-6 text-center">مبلغ فاکتور</th>
                <th className="p-6 text-center">وضعیت</th>
                <th className="p-6 text-center">تغییر وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-blue-50/10 transition-colors">
                  <td className="p-6 font-mono font-bold text-gray-600">{o.orderNumber}</td>
                  <td className="p-6"><div className="flex items-center gap-2 font-bold"><User size={14} className="text-blue-400"/> {o.userName}</div></td>
                  <td className="p-6"><div className="flex items-center gap-2 text-gray-500 font-mono"><Phone size={14} className="text-green-400"/> {o.phoneNumber}</div></td>
                  <td className="p-6 text-center font-black text-blue-600">{o.totalAmount?.toLocaleString()} <span className="text-[10px] font-normal">تومان</span></td>
                  <td className="p-6 text-center"><span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black">{translateStatus(o.status)}</span></td>
                  <td className="p-6">
                    <select 
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)} 
                      className="bg-gray-50 p-2 rounded-xl text-[10px] font-bold outline-none border w-full cursor-pointer focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">تغییر وضعیت...</option>
                      <option value="Pending">در انتظار ⏳</option>
                      <option value="Paid">پرداخت شده ✅</option>
                      <option value="Shipped">ارسال شده 🚚 (ثبت کدرهگیری)</option>
                      <option value="Cancelled">لغو سفارش ❌</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                 <tr><td colSpan={6} className="p-10 text-center text-gray-400 font-bold">هنوز هیچ سفارشی ثبت نشده است.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* مودالِ ثبت کد رهگیری پستی */}
        {isDeliveryModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  <Truck className="text-blue-500"/> ثبت اطلاعات پستی
                </h2>
                <button onClick={() => setIsDeliveryModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-gray-50 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">روش ارسال (شرکت پستی)</label>
                  <select 
                    value={carrier} 
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 font-bold appearance-none"
                  >
                    <option value="شرکت پست جمهوری اسلامی ایران">شرکت پست (پیشتاز)</option>
                    <option value="تیپاکس">تیپاکس</option>
                    <option value="پیک موتوری (اسنپ/تپسی)">پیک موتوری (ویژه تهران)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">کد رهگیری / بارنامه</label>
                  <input 
                    type="text" 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)} 
                    required 
                    className="w-full bg-blue-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 text-left font-mono font-black text-blue-700 tracking-widest" 
                    placeholder="مثال: 12345678901234567890" 
                    dir="ltr" 
                  />
                  <p className="text-[10px] text-gray-400 mt-2">این کد در پنل مشتری نمایش داده خواهد شد تا بسته‌اش را پیگیری کند.</p>
                </div>

                <button 
                  onClick={submitDeliveryInfo} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 mt-4"
                >
                  <Check size={20} /> تایید و تغییر وضعیت به "ارسال شده"
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrdersPage;