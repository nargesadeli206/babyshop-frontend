import { useState } from 'react';
import { environment } from '../config/environment';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تابع کمکی برای گرفتن توکن معتبر
  const getToken = () => localStorage.getItem('token');

  // ۱. شروع فرآیند پرداخت و ایجاد تراکنش
  const startPayment = async (orderId: number, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${environment.apiUrl}/Payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify({
          OrderId: orderId,
          Amount: amount,
          PaymentMethod: "Online"
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'خطا در ایجاد تراکنش پرداخت');
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ۲. تایید نهایی پرداخت (Verify) - هماهنگ با PaymentController
  const verifyPayment = async (paymentId: number, refNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      // ارسال پارامترها به صورت Query String چون در کنترلر DTO تعریف نشده است
      const url = `${environment.apiUrl}/Payment/verify?paymentId=${paymentId}&referenceNumber=${refNumber}`;
      
      const response = await fetch(url, {
        method: 'POST', // طبق [HttpPost("verify")] در کد شما
        headers: { 
          'Authorization': `Bearer ${getToken()}` 
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'تایید پرداخت با خطا مواجه شد');
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { startPayment, verifyPayment, loading, error };
};