import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../shared/context/CartContext';
import { useOrders } from '../../hooks/useOrders';
import { usePayment } from '../../../../shared/hooks/usePayment';
import { MapPin, Phone, Mail, Hash, Truck, ArrowRight, ShieldCheck, PenTool } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();
  const { startPayment, loading: paymentLoading } = usePayment();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  
  // استیت‌های مربوط به ارسال
  const [shippingMethod, setShippingMethod] = useState<'post' | 'peyk'>('post');
  
  // پیش‌فرض: پست پیشتاز ۱۳۰ تومن
  const [shippingCost, setShippingCost] = useState(130000); 

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // تغییر قیمت پست بر اساس انتخاب مشتری
  useEffect(() => {
    if (shippingMethod === 'post') {
      setShippingCost(130000); // پست پیشتاز 130 هزار تومان
    } else {
      setShippingCost(0); // پیک موتوری پس‌کرایه است (هزینه در سایت 0)
    }
  }, [shippingMethod]);

  const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subTotal * 0.08); // ۸٪ مالیات
  
  const totalAmount = subTotal + tax + shippingCost;

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length < 10) return alert('لطفاً شماره موبایل را صحیح وارد کنید.');
    if (postalCode.length < 5) return alert('کد پستی نامعتبر است.');

    const fullAddress = `روش ارسال: ${shippingMethod === 'post' ? 'پست پیشتاز' : 'پیک موتوری (پس‌کرایه)'} | آدرس: ${address} | کد پستی: ${postalCode}`;

    const orderData = {
      ShippingAddress: fullAddress,
      PhoneNumber: phone,
      Email: email || "user@ziizii.com",
      
      CustomerNote: customerNote 
        ? `${customerNote} | (هزینه ارسال: ${shippingMethod === 'post' ? '130,000' : 'پس‌کرایه'} - مالیات: ${tax})` 
        : `(هزینه ارسال: ${shippingMethod === 'post' ? '130,000' : 'پس‌کرایه'} - مالیات: ${tax})`, 
      
      Items: cartItems.map(item => ({
        ProductId: item.id,
        ProductName: item.name,
        Quantity: item.quantity,
        UnitPrice: item.price
      }))
    };

    const orderResult = await createOrder(orderData);
    if (orderResult.success) {
      const orderId = orderResult.data.id || orderResult.data.Id;
      const paymentResult = await startPayment(orderId, totalAmount);
      
      if (paymentResult.success) {
        clearCart();
        navigate(`/bank-gateway?paymentId=${paymentResult.data.id || paymentResult.data.Id}&amount=${totalAmount}`);
      } else {
        alert("خطا در اتصال به درگاه پرداخت!");
      }
    } else {
      alert("متاسفانه در ثبت سفارش مشکلی پیش آمد. لطفاً اطلاعات را بررسی کنید.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] p-4 md:p-12 text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        <button onClick={() => navigate('/cart')} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-all font-bold">
          <ArrowRight size={20} /> بازگشت به سبد خرید
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-white">
              <h2 className="text-2xl font-black text-gray-800 mb-8 border-r-8 border-blue-500 pr-4 flex items-center gap-2">
                <MapPin className="text-blue-500"/> اطلاعات گیرنده کالا
              </h2>
              
              <form id="checkout-form" onSubmit={handleFinalSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1"><Phone size={14}/> شماره تماس گیرنده *</label>
                    <input type="tel" placeholder="09123456789" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 font-bold" required dir="ltr" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1"><Hash size={14}/> کد پستی *</label>
                    <input type="text" placeholder="مثال: 1234567890" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 font-bold" required dir="ltr" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1"><MapPin size={14}/> آدرس دقیق پستی *</label>
                  <textarea placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد..." value={address} onChange={e => setAddress(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-blue-300 font-bold leading-relaxed" required></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1"><Mail size={14}/> ایمیل (اختیاری)</label>
                    <input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 font-bold" dir="ltr" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1"><PenTool size={14}/> توضیحات سفارش (اختیاری)</label>
                    <input type="text" placeholder="مثلاً: لطفاً کادو پیچ شود 🎁" value={customerNote} onChange={e => setCustomerNote(e.target.value)} className="w-full p-4 bg-orange-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-300 font-bold text-orange-800" />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-white">
              <h2 className="text-2xl font-black text-gray-800 mb-8 border-r-8 border-pink-500 pr-4 flex items-center gap-2">
                <Truck className="text-pink-500"/> روش ارسال را انتخاب کنید
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setShippingMethod('post')}
                  className={`p-6 rounded-[2rem] border-4 cursor-pointer transition-all ${shippingMethod === 'post' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-pink-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-gray-700">پست پیشتاز</h3>
                    {shippingMethod === 'post' && <div className="w-5 h-5 bg-pink-500 rounded-full flex justify-center items-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                  </div>
                  <p className="text-xs text-gray-500 mb-4">ارسال به سراسر کشور (۳ تا ۵ روز کاری)</p>
                  <div className="font-black text-pink-600">۱۳۰,۰۰۰ تومان</div>
                </div>

                <div 
                  onClick={() => setShippingMethod('peyk')}
                  className={`p-6 rounded-[2rem] border-4 cursor-pointer transition-all ${shippingMethod === 'peyk' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-gray-700">پیک موتوری (تهران)</h3>
                    {shippingMethod === 'peyk' && <div className="w-5 h-5 bg-blue-500 rounded-full flex justify-center items-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                  </div>
                  <p className="text-xs text-gray-500 mb-4">هزینه پیک درب منزل توسط مشتری پرداخت می‌شود.</p>
                  <div className="font-black text-blue-600">پس‌کرایه</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-white sticky top-24">
              <h2 className="text-xl font-black text-gray-800 mb-6">خلاصه فاکتور</h2>
              
              <div className="space-y-4 text-sm font-bold text-gray-500 border-b-2 border-gray-50 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>مبلغ کل کالاها:</span>
                  <span className="text-gray-700">{subTotal.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span>هزینه بسته‌بندی و مالیات:</span>
                  <span className="text-gray-700">{tax.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>هزینه ارسال:</span>
                  {shippingMethod === 'peyk' ? (
                     <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px]">پس‌کرایه</span>
                  ) : (
                     <span className="text-gray-700">{shippingCost.toLocaleString()} تومان</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-black text-gray-800 text-lg">مبلغ قابل پرداخت:</span>
                <span className="text-2xl font-black text-pink-600">{totalAmount.toLocaleString()} <span className="text-[10px] text-pink-400 font-normal">تومان</span></span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={orderLoading || paymentLoading} 
                className="w-full py-5 bg-pink-500 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-pink-200 hover:bg-pink-600 hover:-translate-y-1 transition-all active:scale-95 flex justify-center items-center gap-2"
              >
                {orderLoading || paymentLoading ? 'در حال اتصال...' : <><ShieldCheck size={24} /> پرداخت امن</>}
              </button>
              
              <p className="text-[10px] text-center text-gray-400 mt-4">پرداخت از طریق درگاه‌های امن بانکی (شاپرک) انجام می‌شود.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;