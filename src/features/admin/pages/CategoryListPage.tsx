import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Plus, Trash2, Edit, AlertCircle, Check, X, Tag } from 'lucide-react';

interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

const CategoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // استیت‌های مربوط به مودال ثبت/ویرایش
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  // فیلدهای فرم
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = 'https://localhost:7168/api/Category';

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    // ساخت اسلاگ (Slug) به صورت اتوماتیک
    const autoSlug = val.trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase();
    setSlug(autoSlug || `category-${Math.floor(Math.random() * 1000)}`);
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentId(null);
    setName('');
    setSlug('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryDto) => {
    setEditMode(true);
    setCurrentId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setIsModalOpen(true);
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        id: currentId || 0, // در حالت Add این صفر میره
        name,
        slug,
        description,
        displayOrder: 0,
        isActive: true
      };

      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(API_URL, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(editMode ? 'دسته‌بندی آپدیت شد 🚀' : 'دسته‌بندی جدید ثبت شد 🎉');
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(`خطا: ${errorData.message}`);
      }
    } catch (error) {
      alert('خطا در ارتباط با سرور');
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm('آیا از حذف این دسته‌بندی مطمئن هستی؟ (ممکنه لباس‌هاش هم پاک بشن!)')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('دسته‌بندی حذف شد 🗑️');
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(`خطا: ${errorData.message}`);
      }
    } catch (error) {
      alert('خطا در ارتباط با سرور');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-right font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="text-blue-500" /> مدیریت دسته‌بندی‌ها
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={openAddModal} 
              className="bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> دسته‌بندی جدید
            </button>
          </div>
        </header>

        {/* لیست */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-5 font-bold">نام دسته‌بندی</th>
                <th className="p-5 font-bold">لینک انگلیسی (Slug)</th>
                <th className="p-5 font-bold text-center">وضعیت</th>
                <th className="p-5 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-blue-400 font-bold animate-pulse">در حال دریافت اطلاعات... 🌈</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400">
                    <AlertCircle className="mx-auto mb-2 text-orange-300" /> هیچ دسته‌بندی پیدا نشد.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="p-5 font-black text-gray-700 text-base">{cat.name}</td>
                    <td className="p-5 text-gray-400 font-mono text-xs" dir="ltr">{cat.slug}</td>
                    <td className="p-5 text-center">
                      {cat.isActive 
                        ? <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">فعال ✅</span>
                        : <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-bold">غیرفعال ❌</span>
                      }
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(cat)} className="bg-orange-50 text-orange-500 p-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal ثبت و ویرایش */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  <Tag className="text-blue-500"/> {editMode ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-gray-50 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveCategory} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">نام دسته‌بندی (فارسی)</label>
                  <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} required className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 font-bold" placeholder="مثلاً: سیسمونی نوزاد" />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">نام انگلیسی (اتوماتیک)</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 text-left font-mono text-sm" dir="ltr" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">توضیحات (اختیاری)</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]"></textarea>
                </div>

                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2">
                  <Check size={20} /> {editMode ? 'ذخیره تغییرات' : 'ثبت دسته‌بندی'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryListPage;