import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { usePayment } from '../../../shared/hooks/usePayment';

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment } = usePayment();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const hasVerified = useRef(false);

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const isOk = searchParams.get('status') === 'OK'; // چک کردن تایید درگاه

    if (paymentId && isOk && !hasVerified.current) {
      hasVerified.current = true;
      const fakeRef = "ZIZI-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      verifyPayment(Number(paymentId), fakeRef).then((res: any) => {
        if (res && res.success) setStatus('success');
        else setStatus('error');
      });
    } else if (!isOk) {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FFF9F9] flex items-center justify-center p-8 text-center" dir="rtl">
       <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-pink-100 max-w-md w-full">
          {status === 'loading' && <p className="animate-pulse text-pink-500 font-bold">در حال تایید نهایی... ⏳</p>}
          {status === 'success' && (
            <>
              <div className="text-8xl mb-6">✅</div>
              <h1 className="text-2xl font-black text-green-500">پرداخت موفق!</h1>
              <p className="text-gray-400 mt-4 mb-8">سفارش شما با موفقیت ثبت و تایید شد. 🧸✨</p>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold shadow-lg">مشاهده سفارش</button>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="text-8xl mb-6">❌</div>
              <h1 className="text-2xl font-black text-red-500">خطا در تراکنش</h1>
              <p className="text-gray-400 mt-4 mb-8">یا انصراف دادید یا مشکلی در پرداخت پیش اومده.</p>
              <button onClick={() => navigate('/cart')} className="w-full bg-gray-100 py-4 rounded-2xl font-bold">بازگشت به سبد خرید</button>
            </>
          )}
       </div>
    </div>
  );
};

export default PaymentResultPage;