import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../product/hooks/useProducts';
import { useInventory } from '../../../shared/hooks/useInventory';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useCart } from '../../../shared/context/CartContext';
import { useWishlist } from '../../../shared/context/WishlistContext';

const HomePage: React.FC = () => {
  const { products } = useProducts(); // گرفتن کل محصولات برای فیلتر سمت کلاینت
  const { getAllInventory } = useInventory();
  const { logout } = useAuth();
  const { cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  
  // استیت‌های جستجو و فیلتر
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGender, setActiveGender] = useState(0);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  // ۱. دریافت دسته‌بندی‌ها از سرور (فقط دسته‌های فعال)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7168/api/Category');
        const result = await response.json();
        const allCategories = result.data || [];
        
        // فیلتر کردن دسته‌بندی‌های غیرفعال
        const activeOnly = allCategories.filter((c: any) => c.isActive === true);
        setCategories(activeOnly);
      } catch (error) {
        console.error("خطا در دریافت دسته‌بندی‌ها");
      }
    };
    fetchCategories();
  }, []);

  // ۲. هماهنگ‌سازی موجودی با انبار
  useEffect(() => {
    const sync = async () => {
      setLoading(true);
      const inventoryData = await getAllInventory();
      if (Array.isArray(inventoryData)) {
        const map: Record<number, number> = {};
        inventoryData.forEach((item: any) => { 
          // جمع کردن موجودی کل سایزهای یک محصول
          if(map[item.productId]) {
            map[item.productId] += item.currentStock;
          } else {
            map[item.productId] = item.currentStock;
          }
        });
        setInventoryMap(map);
      }
      setLoading(false);
    };
    sync();
  }, [products]);

  // متد کمکی برای خوندن عکس اول
  const getImageUrl = (path?: string) => {
    if (!path) return 'https://placehold.co/600x600/FFD1DC/white?text=🧸';
    const firstPath = path.split('|')[0];
    return firstPath.startsWith('http') ? firstPath : `https://localhost:7168${firstPath}`;
  };

  // ----- فیلتر جادویی (جستجو + جنسیت + دسته‌بندی) -----
  const filteredProducts = products.filter((p: any) => {
    // فیلتر جستجوی متنی
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // فیلتر جنسیت (با == چک می‌کنیم که استرینگ و عدد با هم مچ بشن)
    const matchesGender = activeGender === 0 || p.gender == activeGender || p.gender == 3;
    
    // فیلتر دسته‌بندی (اگر نال بود یعنی همه دسته‌ها)
    const matchesCategory = activeCategory === null || p.categoryId == activeCategory;

    return matchesSearch && matchesGender && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFF9F9] font-sans text-right" dir="rtl">
      
      {/* هدر سایت */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 p-4 shadow-sm flex justify-between items-center px-8 border-b-2 border-pink-100">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {navigate('/'); setActiveCategory(null); setActiveGender(0);}}>
          <span className="text-3xl animate-pulse">🧸</span>
          <div className="text-2xl font-black text-pink-600">زی‌زی کیدز</div>
        </div>
        <div className="flex items-center gap-3">
          <div onClick={() => navigate('/cart')} className="relative bg-pink-50 p-2 rounded-full px-5 text-pink-500 text-sm font-bold border border-pink-200 cursor-pointer shadow-sm">
            🛒 سبد خرید {cartItems.length > 0 && <span className="absolute -top-2 -left-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] animate-bounce shadow-md">{cartItems.length}</span>}
          </div>
          <div onClick={() => navigate('/dashboard')} className="bg-white p-2 rounded-full border border-pink-100 cursor-pointer px-4 text-gray-600 font-bold text-sm shadow-sm">👤 حساب من</div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 text-xs font-bold px-2">خروج</button>
        </div>
      </header>

      {/* بنر اصلی و منوی دسته‌بندی */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-white to-blue-50 py-20 px-8 mb-4 rounded-b-[5rem] shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-right">
          <div className="z-10 flex-1">
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6 leading-tight">دنیای لباس‌های <br /> <span className="text-pink-500 text-5xl md:text-7xl">خاص و با کیفیت!</span></h1>
            <p className="text-gray-500 text-xl font-medium mb-10">بهترین انتخاب برای خوش‌پوش‌ترین فرشته‌های زمینی ✨</p>
            
            {/* منوی دسته‌بندی‌ها */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8">
              <button 
                onClick={() => setActiveCategory(null)} 
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${activeCategory === null ? 'bg-pink-500 text-white' : 'bg-white text-gray-500 hover:bg-pink-50'}`}
              >
                🌟 همه قفسه‌ها
              </button>
              {categories.map((c: any) => (
                <button 
                  key={c.id || c.Id} 
                  onClick={() => setActiveCategory(c.id || c.Id)} 
                  className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${activeCategory === (c.id || c.Id) ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-blue-50'}`}
                >
                  {c.name || c.Name}
                </button>
              ))}
            </div>

          </div>
          <div className="flex-1 flex justify-center relative">
             <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem] bg-white/40 rounded-full flex items-center justify-center border-8 border-white/60 shadow-2xl overflow-visible animate-float">
                <span className="text-[12rem] md:text-[16rem] z-20">🧸</span>
                <span className="absolute -top-10 -right-10 text-8xl md:text-[10rem] animate-bounce">🍼</span>
                <span className="absolute -bottom-5 -left-5 text-7xl md:text-9xl animate-pulse">👕</span>
             </div>
          </div>
        </div>
      </section>

      {/* جستجو و فیلتر جنسیت */}
      <div className="max-w-3xl mx-auto -mt-10 relative z-20 px-4 text-center">
        <div className="bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-white">
          <input 
            type="text" 
            placeholder="دنبال چی میگردی مامانی؟ 🔍" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-5 rounded-full bg-pink-50/30 focus:bg-white outline-none transition-all text-gray-700 font-bold mb-4"
          />
          <div className="flex justify-center gap-3">
             <button onClick={() => setActiveGender(0)} className={`px-6 py-2 rounded-2xl font-bold transition-all text-xs ${activeGender === 0 ? 'bg-pink-500 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-pink-50'}`}>🌈 همه</button>
             <button onClick={() => setActiveGender(1)} className={`px-6 py-2 rounded-2xl font-bold transition-all text-xs ${activeGender === 1 ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-50 text-blue-500'}`}>👦 پسرانه</button>
             <button onClick={() => setActiveGender(2)} className={`px-6 py-2 rounded-2xl font-bold transition-all text-xs ${activeGender === 2 ? 'bg-pink-500 text-white shadow-lg' : 'bg-pink-50 text-pink-500'}`}>👧 دخترانه</button>
          </div>
        </div>
      </div>

      {/* ویترین محصولات */}
      <main className="max-w-7xl mx-auto p-8 mt-12">
        <div className="flex justify-between items-center mb-12">
           <h2 className="text-3xl font-black text-gray-800 pr-4 border-r-8 border-pink-500">ویترین محصولات</h2>
           <div className="text-sm font-bold text-gray-400 bg-white px-4 py-2 rounded-full shadow-sm">{filteredProducts.length} محصول پیدا شد</div>
        </div>
        
        {filteredProducts.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-pink-100">
              <div className="text-6xl mb-4">🥺</div>
              <h3 className="text-2xl font-black text-gray-400">هیچ لباسی با این مشخصات پیدا نکردیم!</h3>
              <p className="text-gray-300 mt-2 font-medium">لطفاً فیلترها رو عوض کن یا یه چیز دیگه جستجو کن.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product: any) => {
              // موجودی کلی این محصول تو همه سایزها
              const realStock = inventoryMap[product.id] ?? 0;
              const isOutOfStock = realStock <= 0;

              return (
                <div key={product.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 border-white hover:border-pink-100 flex flex-col h-full relative group">
                  {isOutOfStock && <div className="absolute top-5 left-5 z-20 bg-gray-500 text-white px-3 py-1 rounded-xl text-[10px] font-bold shadow-lg">تمام شده</div>}
                  
                  {/* دکمه علاقه‌مندی‌ها */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} 
                    className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-xl transition-all hover:scale-110 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-300'}`}
                  >
                    {isInWishlist(product.id) ? '❤️' : '🤍'}
                  </button>
                  
                  <div className={`h-72 bg-[#fdf2f2] cursor-pointer rounded-t-[3rem] overflow-hidden ${isOutOfStock ? 'opacity-40 grayscale' : ''}`} onClick={() => navigate(`/product/${product.id}`)}>
                    <img src={getImageUrl(product.imageUrl)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow text-center">
                    <h3 className="font-black text-gray-700 text-xl mb-3">{product.name}</h3>
                    <div className="mt-auto">
                      <div className={`text-2xl font-black mb-6 ${isOutOfStock ? 'text-gray-300' : 'text-pink-500'}`}>
                        {product.price?.toLocaleString()} <span className="text-[10px] font-medium text-gray-400">تومان</span>
                      </div>
                      
                      {/* دکمه انتقال به صفحه جزئیات */}
                      <button 
                        onClick={() => navigate(`/product/${product.id}`)} 
                        className={`w-full font-bold py-4 rounded-[1.5rem] transition-all flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-gray-100 text-gray-400' : 'bg-[#fdf2f2] text-pink-600 hover:bg-pink-500 hover:text-white shadow-sm'}`}
                      >
                        {isOutOfStock ? '❌ ناموجود' : '👀 مشاهده و انتخاب سایز'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      
      <footer className="bg-white mt-32 py-12 border-t border-pink-50 text-center text-gray-300 text-xs">🧸 ساخته شده با عشق در زی‌زی کیدز</footer>
    </div>
  );
};

export default HomePage;