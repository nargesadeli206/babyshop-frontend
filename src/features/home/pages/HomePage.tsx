// src/features/home/pages/HomePage.tsx
import React from 'react';
import { useProducts } from '../../product/hooks/useProducts';
import ProductCard from '../../product/components/ProductCard';
import SoftButton from '../../../shared/components/Button/SoftButton';
import { ProductDto } from '../../../core/interfaces';

const HomePage: React.FC = () => {
  const { products, loading } = useProducts();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white-warm to-secondary-cream">
      {/* بخش Hero با انیمیشن */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* پس‌زمینه با عروسک‌های شناور */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-float">🧸</div>
          <div className="absolute bottom-10 right-10 text-8xl animate-float" style={{ animationDelay: '1s' }}>🎀</div>
          <div className="absolute top-20 right-20 text-8xl animate-float" style={{ animationDelay: '2s' }}>🍼</div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="font-playful text-5xl md:text-7xl text-primary-warm mb-6 animate-bounce-slow">
            دنیای عروسکی کودکانه 🧸
          </h1>
          <p className="font-soft text-xl text-text-light mb-8 max-w-2xl mx-auto">
            لباس‌های نرم و لطیف برای عروسک‌های دوست‌داشتنی شما
          </p>
          <div className="flex gap-4 justify-center">
            <SoftButton size="large" variant="primary">
              🎀 شروع خرید
            </SoftButton>
            <SoftButton size="large" variant="outline">
              👀 مشاهده مجموعه
            </SoftButton>
          </div>
        </div>
      </section>
      
      {/* بخش محصولات ویژه */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="font-playful text-4xl text-center text-text-soft mb-4">
            محصولات ویژه 🎁
          </h2>
          <p className="font-soft text-center text-text-light mb-12">
            لباس‌های نرم و قشنگ برای عروسک‌های خوشگلت
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-6xl animate-bounce">🧸</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products && products.map((product: ProductDto) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* بخش ویژگی‌ها با آیکون‌های عروسکی */}
      <section className="bg-secondary-cream py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-soft bg-white-warm shadow-soft transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4 animate-float">🧵</div>
              <h3 className="font-playful text-2xl text-text-soft mb-2">دست‌دوز نرم</h3>
              <p className="font-soft text-text-light">همه لباس‌ها با نرم‌ترین پارچه‌ها</p>
            </div>
            
            <div className="text-center p-6 rounded-soft bg-white-warm shadow-soft transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4 animate-float" style={{ animationDelay: '0.5s' }}>🎨</div>
              <h3 className="font-playful text-2xl text-text-soft mb-2">رنگ‌های شاد</h3>
              <p className="font-soft text-text-light">ترکیب رنگ‌های ملایم و قشنگ</p>
            </div>
            
            <div className="text-center p-6 rounded-soft bg-white-warm shadow-soft transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4 animate-float" style={{ animationDelay: '1s' }}>🎁</div>
              <h3 className="font-playful text-2xl text-text-soft mb-2">بسته‌بندی کادویی</h3>
              <p className="font-soft text-text-light">ارسال با بسته‌بندی مخصوص عروسک</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;