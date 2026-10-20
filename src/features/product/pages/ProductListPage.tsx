import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts'; // هوک محصولات
import { Search, Plus, Edit, Trash2, Tag, AlertCircle, ShoppingBag } from 'lucide-react';

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  // فیلتر کردن محصولات برای جستجو
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p: any) => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // متد کمکی برای استخراج اولین عکس از گالری
  const getImageUrl = (path?: string) => {
    if (!path) return 'https://placehold.co/100x100/FFD1DC/white?text=👗';
    const firstPath = path.split('|')[0];
    return firstPath.startsWith('http') ? firstPath : `https://localhost:7168${firstPath}`;
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`آیا از حذفِ محصول "${name}" کاملاً مطمئنی؟ 🗑️`)) {
      const result = await deleteProduct(id);
      if (result.success) {
        alert("محصول با موفقیت حذف شد.");
        // نیاز به ریلود یا استیت-آپدیت داره که تو هوک useProducts هندل میشه
        window.location.reload(); 
      } else {
        alert("خطا در حذف محصول!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] p-4 md:p-8 text-right font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border-b-4 border-pink-400 gap-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-pink-500" size={32} />
            <div>
              <h1 className="text-2xl font-black text-gray-800">لیست ویترین (محصولات)</h1>
              <p className="text-gray-400 text-xs font-bold mt-1">مدیریت قیمت‌ها، موجودی و ویرایش لباس‌ها</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/dashboard" className="text-pink-500 font-bold hover:bg-pink-50 px-4 py-2 rounded-xl transition-all ml-4">
              ← پنل کاربری
            </Link>
            <button 
              onClick={() => navigate('/products/create')} 
              className="bg-pink-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg hover:bg-pink-600 transition-all flex items-center gap-2 flex-1 md:flex-none justify-center"
            >
              <Plus size={18} /> لباس جدید
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-md mb-8 border-2 border-white focus-within:border-pink-200 transition-all relative">
          <input 
            type="text" 
            placeholder="جستجوی نام یا شناسه انگلیسی (Slug) محصول..." 
            className="w-full pl-12 pr-4 py-2 outline-none font-bold text-gray-700 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border-4 border-white">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-pink-50/50 text-pink-800 text-sm border-b-2 border-pink-100">
                <th className="p-6 font-black w-16 text-center">عکس</th>
                <th className="p-6 font-black">نام محصول</th>
                <th className="p-6 font-black">دسته‌بندی</th>
                <th className="p-6 font-black text-center">قیمت فروش</th>
                <th className="p-6 font-black text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-pink-500 font-bold animate-pulse">در حال خواندن قفسه‌ها... 👗</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-medium italic"><AlertCircle className="mx-auto mb-2 opacity-50" size={32}/> هیچ محصولی پیدا نشد!</td></tr>
              ) : (
                filteredProducts.map((product: any) => (
                  <tr key={product.id} className="hover:bg-pink-50/30 transition-all group">
                    <td className="p-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-50 shadow-sm mx-auto bg-gray-50">
                        <img src={getImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-black text-gray-800 text-base">{product.name}</div>
                      <div className="text-gray-400 text-[10px] font-mono mt-1 bg-gray-100 px-2 py-0.5 rounded w-max">
                        {product.slug}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full w-max">
                        <Tag size={12}/> {product.categoryName || 'دسته‌بندی نشده'}
                      </span>
                    </td>
                    <td className="p-6 text-center font-black text-pink-600 text-lg">
                      {product.price?.toLocaleString()} <span className="text-[10px] font-normal text-pink-400">تومان</span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-2">
                        {/* دکمه ویرایش (وصل می‌شود به صفحه‌ی ProductEditPage) */}
                        <button 
                          onClick={() => navigate(`/products/edit/${product.id}`)}
                          className="bg-blue-50 text-blue-500 p-3 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                          title="ویرایش محصول"
                        >
                          <Edit size={18} />
                        </button>
                        
                        {/* دکمه حذف */}
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="حذف محصول"
                        >
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

      </div>
    </div>
  );
};

export default ProductListPage;