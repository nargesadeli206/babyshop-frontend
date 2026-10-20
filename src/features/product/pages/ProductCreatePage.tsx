import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, X, ArrowRight, Tag, Layers, Baby, Users, AlignRight, Link2 } from 'lucide-react';

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('1'); 
  const [categoryId, setCategoryId] = useState('');
  
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [ageStocks, setAgeStocks] = useState<{ [key: string]: string }>({});
  
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const ageOptions = [
    { code: '0-3', label: 'نوزاد (۰-۳ ماه)' },
    { code: '3-6', label: '۳ تا ۶ ماه' },
    { code: '6-12', label: '۶ تا ۱۲ ماه' },
    { code: '12-24', label: '۱ تا ۲ سال' },
    { code: '24+', label: 'بالای ۲ سال' },
  ];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('https://localhost:7168/api/Category');
        const result = await response.json();
        const data = result.data || result;
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id || data[0].Id);
      } catch {
        setCategories([{ id: 1, name: 'لباس نوزادی' }, { id: 2, name: 'اکسسوری' }]);
      }
    };
    fetchCats();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    let autoSlug = val.trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase();
    if (autoSlug.length === 0) {
      autoSlug = `product-${Math.floor(Math.random() * 1000000)}`;
    }
    setSlug(autoSlug);
  };

  const toggleAge = (code: string) => {
    setSelectedAges(prev => {
      if (prev.includes(code)) {
        const newStocks = { ...ageStocks };
        delete newStocks[code];
        setAgeStocks(newStocks);
        return prev.filter(c => c !== code);
      } else {
        setAgeStocks(prevStocks => ({ ...prevStocks, [code]: '0' }));
        return [...prev, code];
      }
    });
  };

  const handleStockChange = (code: string, value: string) => {
    setAgeStocks(prev => ({ ...prev, [code]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAges.length === 0) return alert('لطفاً حداقل یک رده سنی انتخاب کن مامانی! 👶');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('Name', name);
      formData.append('Slug', slug || `product-${Date.now()}`); 
      formData.append('Price', price);
      formData.append('Description', description);
      formData.append('Gender', gender);
      formData.append('CategoryId', categoryId);
      formData.append('AgeRange', selectedAges[0]);

      const inventoryDetails = selectedAges.map(code => ({
        AgeRange: code,
        Stock: parseInt(ageStocks[code] || '0', 10)
      }));
      formData.append('InventoryDetails', JSON.stringify(inventoryDetails));
      
      const totalStock = inventoryDetails.reduce((sum, item) => sum + item.Stock, 0);
      formData.append('InitialStock', totalStock.toString());

      images.forEach((file) => formData.append('Images', file));

      const response = await fetch('https://localhost:7168/api/Product', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: formData 
      });

      if (response.ok) {
        alert('محصول جدید با موفقیت ثبت شد! ✨');
        navigate('/admin/inventory'); 
      } else {
        const err = await response.json();
        alert(`خطا: ${err.message || 'مشکلی در ثبت رخ داد'}`);
      }
    } catch {
      alert('خطای اتصال به سرور!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F8] p-4 md:p-12 text-right font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-white relative">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-10 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black mb-2">✨ تعریف لباس جدید زی‌زی</h1>
            <p className="text-blue-100 text-sm font-medium">مشخصات رو کامل پر کن تا بریم برای فروش!</p>
          </div>
          <button onClick={() => navigate(-1)} className="bg-white/20 p-4 rounded-3xl hover:bg-white/30 transition-all shadow-inner">
            <ArrowRight size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2"><Tag size={20} /><span className="font-black text-lg">اطلاعات پایه</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 mr-2">نام لباس</label><input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} className="w-full p-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-blue-400 outline-none font-bold transition-all" required /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-gray-400 mr-2 flex items-center gap-1"><Link2 size={12}/> اسم انگلیسی (Slug)</label><input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full p-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-blue-400 outline-none text-left font-mono" dir="ltr" required /></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-xs font-black text-gray-400 mr-2">قیمت (تومان)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-blue-400 outline-none font-black text-blue-600" required /></div>
            <div className="space-y-2"><label className="text-xs font-black text-gray-400 mr-2 flex items-center gap-1"><Layers size={12}/> دسته بندی</label><select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-blue-400 outline-none font-bold appearance-none">{categories.map(c => <option key={c.id || c.Id} value={c.id || c.Id}>{c.name || c.Name}</option>)}</select></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-[2.5rem]">
            <div className="space-y-3"><label className="text-sm font-black text-gray-600 mr-2 flex items-center gap-1"><Users size={16}/> این لباس برای کیه؟</label><div className="flex gap-2">{[ {id:'1', l:'پسرانه 👦'}, {id:'2', l:'دخترانه 👧'}, {id:'3', l:'هر دو 🌈'} ].map(g => (<button key={g.id} type="button" onClick={() => setGender(g.id)} className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all ${gender === g.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200'}`}>{g.l}</button>))}</div></div>
            <div className="space-y-3"><label className="text-sm font-black text-gray-600 mr-2 flex items-center gap-1"><Baby size={16}/> رده‌های سنی مناسب:</label><div className="flex flex-wrap gap-2">{ageOptions.map(age => (<button key={age.code} type="button" onClick={() => toggleAge(age.code)} className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${selectedAges.includes(age.code) ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:border-pink-200'}`}>{age.label}</button>))}</div></div>
          </div>

          {selectedAges.length > 0 && (
            <div className="bg-blue-50/50 p-6 rounded-[2.5rem] border-2 border-blue-50 space-y-4">
              <label className="text-sm font-black text-blue-600 flex items-center gap-2"> موجودی انبار برای سایزهای انتخابی:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedAges.map(code => {
                  const option = ageOptions.find(o => o.code === code);
                  return (
                    <div key={code} className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                      <span className="block text-xs font-bold text-gray-500 mb-2">{option?.label}</span>
                      <input type="number" value={ageStocks[code] || ''} onChange={(e) => handleStockChange(code, e.target.value)} placeholder="تعداد..." className="w-full bg-gray-50 border-none rounded-xl p-3 text-center font-black outline-none focus:ring-2 focus:ring-blue-300" required />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2"><label className="text-xs font-black text-gray-400 mr-2 flex items-center gap-1"><AlignRight size={14}/> توضیحات محصول</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-6 rounded-[2rem] bg-gray-50 outline-none h-32 border-2 border-transparent focus:border-blue-400 font-bold transition-all"></textarea></div>

          <div className="space-y-4"><label className="text-xs font-black text-gray-400 mr-2 flex items-center gap-1">📸 عکس‌های محصول</label><div className="grid grid-cols-4 sm:grid-cols-6 gap-4 border-4 border-dashed border-gray-50 p-6 rounded-[2.5rem] bg-gray-50/30">{previews.map((src, i) => (<div key={i} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-white shadow-md group"><img src={src} className="w-full h-full object-cover" /><button type="button" onClick={() => removeImage(i)} className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"><X size={14}/></button></div>))}<label className="aspect-square rounded-[1.5rem] bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-blue-400"><Camera size={32} /><span className="text-[9px] font-black mt-2">افزودن</span><input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" /></label></div></div>

          <button type="submit" disabled={loading} className={`w-full py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-gray-300 text-gray-500' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-blue-200 hover:-translate-y-1'}`}>
            {loading ? 'در حال ثبت اطلاعات...' : <><Check size={32} /> تایید و ثبت نهایی محصول</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductCreatePage;