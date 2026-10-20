import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../../shared/hooks/useInventory';
import { Plus, Minus, Package, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';

const InventoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const { getAllInventory, updateStock, deleteInventory, loading } = useInventory();
  const [items, setItems] = useState<any[]>([]);

  const ageLabels: { [key: string]: string } = {
    '0-3': 'نوزاد (۰-۳ ماه)',
    '3-6': '۳ تا ۶ ماه',
    '6-12': '۶ تا ۱۲ ماه',
    '12-24': '۱ تا ۲ سال',
    '24+': 'بالای ۲ سال',
    'default': 'سایز استاندارد'
  };

  const loadData = async () => {
    const data = await getAllInventory();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => { loadData(); }, []);

  const handleStockChange = async (productId: number, ageRange: string, amount: number, type: 'increase' | 'decrease') => {
    const safeAgeRange = ageRange || '0-3'; // اگه خالی بود دیفالت بفرسته
    const result = await updateStock(productId, safeAgeRange, amount, type);
    if (result && result.success) {
      loadData();
    } else {
      alert("خطا در بروزرسانی موجودی!");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("آیا مطمئنی می‌خوای این سایز از این محصول رو کلاً از انبار حذف کنی؟")) {
      const result = await deleteInventory(id);
      if (result && result.success) {
        loadData();
      } else {
        alert("خطا در حذف این محصول از انبار!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-right" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-500" /> مدیریت انبار زی‌زی کیدز
          </h1>
          <div className="flex gap-2">
            <button onClick={() => navigate('/products/create')} className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-green-600 transition-all">
              <Plus size={16} className="inline ml-1"/> افزودن محصول جدید
            </button>
            <button onClick={loadData} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100">
              <RefreshCw size={16} className={`inline ml-1 ${loading ? 'animate-spin' : ''}`} /> بروزرسانی
            </button>
          </div>
        </header>

        {/* لیست محصولات انبار */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-5 w-1/2">نام محصول و سایز</th>
                <th className="p-5 text-center">موجودی فعلی</th>
                <th className="p-5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item: any) => {
                // ترجمه اسم سایز
                const sizeLabel = ageLabels[item.ageRange] || item.ageRange || 'سایز استاندارد';
                
                return (
                  <tr key={item.id} className="hover:bg-blue-50/10 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-gray-800 text-base">{item.productName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded text-xs font-bold">
                          {sizeLabel}
                        </span>
                        <span className="text-[10px] text-gray-400">شناسه: {item.productId}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center font-black text-blue-600 text-xl">
                      {item.currentStock}
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-2 items-center">
                        <button onClick={() => handleStockChange(item.productId, item.ageRange, 1, 'increase')} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-md">
                          <Plus size={18}/>
                        </button>
                        <button onClick={() => handleStockChange(item.productId, item.ageRange, 1, 'decrease')} disabled={item.currentStock <= 0} className="bg-orange-400 text-white p-2 rounded-lg hover:bg-orange-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                          <Minus size={18}/>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-100 ml-4">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {items.length === 0 && !loading && (
            <div className="p-20 text-center text-gray-400">
              <AlertCircle className="mx-auto mb-2 text-orange-300" />
              محصولی با موجودی انبار پیدا نشد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryListPage;