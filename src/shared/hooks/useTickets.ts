import { useState } from 'react';
import { environment } from '../config/environment';

export const useTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token');

  // ۱. لیست تیکت‌های کاربر لاگین شده
  const getMyTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Ticket`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (err) { return []; }
    finally { setLoading(false); }
  };

  // ۲. لیست تمام تیکت‌ها مخصوص ادمین (آدرس اصلاح شد!)
  const getAllTicketsAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/admin/AdminTicket`, { 
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (err) { return []; }
    finally { setLoading(false); }
  };

  // ۳. ثبت تیکت جدید
  const createTicket = async (ticketData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Ticket`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify(ticketData),
      });
      const result = await response.json();
      return result;
    } catch (err) { return { success: false }; }
    finally { setLoading(false); }
  };

  // ۴. ارسال پاسخ (Reply)
  const sendReply = async (ticketId: number, message: string) => {
    try {
      const response = await fetch(`${environment.apiUrl}/Ticket/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ TicketId: ticketId, Message: message }),
      });
      return await response.json();
    } catch (err) { return { success: false }; }
  };

  // ۵. جزئیات یک تیکت خاص
  const getTicketDetails = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${environment.apiUrl}/Ticket/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) { return null; }
    finally { setLoading(false); }
  };

  return { 
    getMyTickets, 
    getAllTicketsAdmin, 
    createTicket, 
    sendReply, 
    getTicketDetails, 
    loading, 
    error 
  };
};