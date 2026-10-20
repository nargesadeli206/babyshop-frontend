import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../../shared/context/CartContext';
import { useInventory } from '../../../shared/hooks/useInventory';
// این خط اضافه شد تا از کانتکستِ خودت استفاده کنه
import { useWishlist } from '../../../shared/context/WishlistContext'; 

interface AgeRangeStock {
  code: string;
  name: string;
  stock: number;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getAllInventory } = useInventory();
  
  // هوک علاقه‌مندی‌های خودت رو اینجا صدا زدیم
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  
  const [availableSizes, setAvailableSizes] = useState<AgeRangeStock[]>([]);
  const [selectedSize, setSelectedSize] = useState<AgeRangeStock | null>(null);

  useEffect(() => {
    const fetchProductAndStock = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://localhost:7168/api/Product/${id}`);
        const result = await res.json();
        const productData = result.data || result;

        if (productData) {
          setProduct(productData);
          
          const imgList = productData.imageUrl ? productData.imageUrl.split('|') : [];
          setImages(imgList);
          setMainImage(imgList[0] || '');

          const inventoryData = await getAllInventory();
          let sizesList: AgeRangeStock[] = [];
          
          const ageLabels: { [key: string]: string } = {
            '0-3': 'نوزاد (۰-۳ ماه)',
            '3-6': '۳ تا ۶ ماه',
            '6-12': '۶ تا ۱۲ ماه',
            '12-24': '۱ تا ۲ سال',
            '24+': 'بالای ۲ سال'
          };
          
          if (Array.isArray(inventoryData)) {
            const productInventory = inventoryData.filter((inv: any) => inv.productId === Number(id));
            if (productInventory.length > 0) {
              sizesList = productInventory.map((inv: any) => {
                const code = inv.ageRange || inv.ageRangeCode || 'default';
                return {
                  code: code,
                  name: ageLabels[code] || inv.ageRangeName || productData.ageRange?.name || 'سایز استاندارد',
                  stock: inv.currentStock || 0
                };
              });
            } else {
              sizesList = [{ code: 'default', name: 'سایز استاندارد', stock: 0 }];
            }
          } else {
             sizesList = [{ code: 'default', name: 'سایز استاندارد', stock: 0 }];
          }

          setAvailableSizes(sizesList);
          const firstAvailable = sizesList.find(s => s.stock > 0) || sizesList[0];
          setSelectedSize(firstAvailable);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndStock();
  }, [id]);

  const getFullImageUrl = (path: string) => {
    if (!path) return 'https://placehold.co/600x600/FFD1DC/white?text=🧸';
    return path.startsWith('http') ? path : `https://localhost:7168${path}`;
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock || !selectedSize) return;
    
    addToCart({ 
      ...product, 
      id: product.id,
      price: product.price, 
      selectedSizeCode: selectedSize.code,
      selectedSizeName: selectedSize.name
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-400 animate-pulse font-bold text-xl">در حال لود کردنِ دنیای رنگی... 🌈</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-gray-400">محصول پیدا نشد! ☹️</div>;

  const isOutOfStock = !selectedSize || selectedSize.stock <= 0;
  const isCompletelyOutOfStock = availableSizes.every(s => s.stock <= 0);

  // بررسی می‌کنیم آیا این محصول تو کانتکستِ علاقه‌مندی‌ها هست یا نه؟
  const isFavorite = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-[#FFF9F9] p-4 md:p-12 font-sans text-right" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-all font-bold">
          <ArrowRight size={20} /> بازگشت به فروشگاه
        </button>

        <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-white grid grid-cols-1 md:grid-cols-2">
          
          <div className="p-8 bg-gray-50/50 flex flex-col gap-6">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-inner bg-white border-4 border-white">
              <img src={getFullImageUrl(mainImage)} className="w-full h-full object-cover transition-all duration-500 hover:scale-105" alt={product.name} />
              
              {isCompletelyOutOfStock && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-red-500 text-white px-8 py-3 rounded-full font-black text-xl shadow-2xl transform -rotate-12">کلاً تمام شده ☹️</span>
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
                {images.map((img, index) => (
                  <button 
                    key={index} onClick={() => setMainImage(img)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all shrink-0 ${mainImage === img ? 'border-pink-400 scale-105 shadow-md' : 'border-white hover:border-pink-200'}`}
                  >
                    <img src={getFullImageUrl(img)} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-10 md:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-pink-100 text-pink-500 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">محصولِ ویژه زی‌زی 🧸</span>
              <div className="flex text-yellow-400 ml-auto">
                <Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/>
              </div>
            </div>

            <h1 className="text-4xl font-black text-gray-800 mb-6 leading-tight">{product.name}</h1>
            
            <p className="text-gray-500 leading-relaxed text-lg mb-8 min-h-[80px]">
              {product.description || "این محصول هنوز توضیحاتی ندارد، اما حتماً مثل همه‌ی لباس‌های زی‌زی‌کیدز، با کیفیت و خوشگله! ✨"}
            </p>

            {availableSizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-400 mb-3">انتخاب سایز / رده سنی:</h3>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((sizeOption, idx) => {
                    const isOutOfThisSize = sizeOption.stock <= 0;
                    const isSelected = selectedSize?.code === sizeOption.code;
                    return (
                      <button
                        key={idx} onClick={() => setSelectedSize(sizeOption)}
                        className={`px-5 py-3 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${isSelected ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-md' : 'border-gray-100 text-gray-500 hover:border-pink-200'} ${isOutOfThisSize && !isSelected ? 'opacity-50 hover:opacity-100' : ''}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{sizeOption.name}</span>
                          {isOutOfThisSize && <span className="text-[10px] text-red-400 font-black">ناموجود</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-pink-50/50 p-8 rounded-[2.5rem] border-2 border-pink-50 mb-10 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">قیمت برای شما:</span>
                <div className="text-3xl font-black text-pink-600">
                  {product.price?.toLocaleString()} <span className="text-sm font-normal text-pink-400">تومان</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-pink-100 pt-4 mt-2">
                <span className="text-gray-400">وضعیت کالا:</span>
                <span className={`font-black ${isOutOfStock ? 'text-red-500' : 'text-green-500'}`}>
                  {isOutOfStock 
                    ? '❌ ناموجود' 
                    : (selectedSize?.stock && selectedSize.stock < 3) 
                      ? `🔥 فقط ${selectedSize.stock} عدد در انبار باقیست!` 
                      : '✅ موجود در انبار زی‌زی'}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart} disabled={isOutOfStock}
                className={`flex-1 py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200'}`}
              >
                <ShoppingCart size={28} />
                {isOutOfStock ? 'سایز انتخاب شده تمام است' : 'افزودن به سبد خرید'}
              </button>
              
              {/* اتصال دکمه قلب به کانتکستِ شما */}
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-20 rounded-[2rem] border-4 flex items-center justify-center transition-all shadow-sm
                  ${isFavorite 
                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 scale-105' 
                    : 'border-pink-100 bg-white text-pink-400 hover:bg-pink-50'
                  }`}
              >
                <Heart size={28} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-pulse" : ""} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12 border-t border-gray-100 pt-8 text-xs font-bold text-gray-400">
              <div className="flex items-center gap-2"><Truck size={16} className="text-blue-300" /> ارسال سریع و مطمئن</div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-300" /> ضمانت کیفیت زی‌زی</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;