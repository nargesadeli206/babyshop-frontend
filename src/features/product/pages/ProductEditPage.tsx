import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// رفع ارور دوم: Edit اضافه شد
import { Camera, Check, X, ArrowRight, Tag, Layers, Users, AlignRight, DollarSign, Edit } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // خواندن متدهای جدید از هوک
  const { getProductById } = useProducts();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('1'); 
  const [categoryId, setCategoryId] = useState('');
  
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch('https://localhost:7168/api/Category');
        const catResult = await catRes.json();
        const cats = catResult.data || [];
        setCategories(cats);

        if (id) {
          const product = await getProductById(Number(id));
          if (product) {
            setName(product.name);
            setPrice(product.price.toString());
            setDescription(product.description || '');
            setCategoryId(product.categoryId?.toString() || (cats.length > 0 ? cats[0].id : ''));
            setGender(product.genderValue?.toString() || '3');

            if (product.imageUrl) {
               setExistingImages(product.imageUrl.split('|'));
            }
          } else {
            alert('محصول پیدا نشد!');
            navigate('/products');
          }
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('Id', id as string);
      formData.append('Name', name);
      formData.append('Price', price);
      formData.append('Description', description);
      formData.append('Gender', gender);
      formData.append('CategoryId', categoryId);
      formData.append('AgeRange', '0-3');

      newImages.forEach((file) => formData.append('NewImages', file));

      const response = await fetch('https://localhost:7168/api/Product', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: formData 
      });

      if (response.ok) {
        alert('تغییرات محصول با موفقیت ذخیره شد! ✏️✨');
        navigate('/products'); 
      } else {
        const err = await response.json();
        alert(`خطا: ${err.message || 'مشکلی در ثبت تغییرات رخ داد'}`);
      }
    } catch {
      alert('خطای اتصال به سرور!');
    } finally {
      setSaving(false);
    }
  };

  const getFullImageUrl = (path: string) => {
    if (!path) return 'https://placehold.co/600x600/FFD1DC/white?text=🧸';
    return path.startsWith('http') ? path : `https://localhost:7168${path}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-500 font-bold text-xl animate-pulse">در حال لود اطلاعات محصول... ⚙️</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 text-right font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-white relative">
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-10 text-white flex justify-between items-center shadow-inner">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-2"><Edit /> ویرایش اطلاعات لباس</h1>
            <p className="text-blue-100 text-sm font-medium">قیمت یا مشخصات رو تغییر بده.</p>
          </div>
          <button onClick={() => navigate('/products')} className="bg-white/20 p-4 rounded-3xl hover:bg-white/30 transition-all shadow-inner">
            <ArrowRight size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2"><Tag size={20} /><span className="font-black text-lg">اطلاعات پایه</span></div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 mr-2">نام لباس (فارسی)</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-5 rounded-[1.5rem] bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300 font-bold transition-all" required />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 mr-2 flex items-center gap-1"><DollarSign size={14}/> قیمت فروش (تومان)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-5 rounded-[1.5rem] bg-blue-50 outline-none focus:ring-2 focus:ring-blue-400 font-black text-blue-700" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 mr-2 flex items-center gap-1"><Layers size={12}/> دسته بندی</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-5 rounded-[1.5rem] bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300 font-bold appearance-none">
                {categories.map(c => <option key={c.id || c.Id} value={c.id || c.Id}>{c.name || c.Name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-gray-50/50 p-6 rounded-[2.5rem]">
            <div className="space-y-3">
              <label className="text-sm font-black text-gray-600 mr-2 flex items-center gap-1"><Users size={16}/> این لباس برای کیه؟</label>
              <div className="flex gap-2">
                {[ {id:'1', l:'پسرانه 👦'}, {id:'2', l:'دخترانه 👧'}, {id:'3', l:'هر دو 🌈'} ].map(g => (
                  <button key={g.id} type="button" onClick={() => setGender(g.id)} className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all ${gender === g.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200'}`}>
                    {g.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 mr-2 flex items-center gap-1"><AlignRight size={14}/> توضیحات محصول</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-6 rounded-[2rem] bg-gray-50 outline-none h-32 focus:ring-2 focus:ring-blue-300 font-bold transition-all"></textarea>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 mr-2">📸 عکس‌های محصول</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 border-4 border-dashed border-gray-100 p-6 rounded-[2.5rem] bg-gray-50/30">
              
              {existingImages.map((src, i) => (
                <div key={`old-${i}`} className="relative aspect-square rounded-[1.5rem] overflow-hidden shadow-md">
                  <img src={getFullImageUrl(src)} className="w-full h-full object-cover opacity-80" alt="Old Image" />
                  <span className="absolute bottom-1 right-2 text-[8px] bg-black/50 text-white px-2 py-0.5 rounded-full">فعلی</span>
                </div>
              ))}

              {previews.map((src, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-blue-400 shadow-md">
                  <img src={src} className="w-full h-full object-cover" alt="New Preview" />
                  <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"><X size={14}/></button>
                </div>
              ))}
              
              <label className="aspect-square rounded-[1.5rem] bg-white border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-blue-400">
                <Camera size={32} />
                <span className="text-[9px] font-black mt-2">افزودن عکس</span>
                <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving} className={`w-full py-6 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${saving ? 'bg-gray-300 text-gray-500' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-blue-200 hover:-translate-y-1'}`}>
            {saving ? 'در حال آپدیت...' : <><Check size={28} /> ذخیره تغییرات لباس</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;