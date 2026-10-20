import React from 'react';
import { useCart } from '../../../shared/context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate(); // تعریف نویگیت

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleGoToCheckout = () => {
    console.log("در حال رفتن به صفحه تسویه‌حساب..."); // برای تست در کنسول F12
    navigate('/checkout'); // رفتن به آدرس تکمیل سفارش
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] font-sans p-8 text-right" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <Link to="/" className="text-pink-500 font-bold">← بازگشت</Link>
          <h1 className="text-3xl font-black text-gray-800 italic">سبد خرید شما 🛒</h1>
        </header>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border-2 border-pink-50">
            <p className="text-gray-400">سبد خریدت فعلاً خالیه عزیزم! 🎈</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm flex items-center gap-6 border-2 border-white hover:border-pink-200 transition-all">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-700 text-xl">{item.name}</h3>
                    <p className="text-pink-500 font-black">{item.price.toLocaleString()} تومان</p>
                  </div>
                  <div className="flex items-center gap-4 bg-pink-50 p-2 rounded-2xl">
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-red-500 font-bold shadow-sm">-</button>
                    <span className="font-black text-pink-600">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-green-500 font-bold shadow-sm">+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* بخش فاکتور */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-pink-100 h-fit sticky top-28">
              <h2 className="text-xl font-bold text-gray-700 mb-6">خلاصه سفارش</h2>
              <div className="text-2xl font-black text-pink-600 mb-8 flex justify-between">
                <span>جمع کل:</span>
                <span>{totalPrice.toLocaleString()} تومان</span>
              </div>
              <button 
                onClick={handleGoToCheckout} // فراخوانی تابع نویگیت
                className="w-full bg-pink-500 text-white py-5 rounded-[2rem] font-bold text-xl shadow-lg hover:bg-pink-600 transition-all transform active:scale-95"
              >
                تکمیل سفارش و پرداخت ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;