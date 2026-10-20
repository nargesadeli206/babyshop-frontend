// src/features/product/components/ProductCard.tsx
import React from 'react';
import { ProductDto } from '../../../core/interfaces';
import SoftButton from '../../../shared/components/Button/SoftButton';
import { getImageUrl } from '../../../shared/utils/imageUrl';

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (product: ProductDto) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-white-warm rounded-extra-large p-6 shadow-soft hover:shadow-warmer transition-all duration-500 transform hover:-translate-y-2">
      {/* برچسب عروسکی */}
      <div className="absolute -top-3 -right-3 bg-primary-warm text-white px-4 py-2 rounded-full text-sm font-playful animate-bounce-slow">
        🧸 جدید
      </div>
      
      {/* تصویر محصول با انیمیشن */}
      <div className="relative mb-4 overflow-hidden rounded-soft">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-soft/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* اطلاعات محصول */}
      <div className="text-center">
        <h3 className="font-playful text-xl text-text-soft mb-2 group-hover:text-primary-warm transition-colors">
          {product.name}
        </h3>
        
        <p className="font-soft text-text-light text-sm mb-3 line-clamp-2">
          {product.description || 'بدون توضیحات'}
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl font-rounded text-primary-warm">
            {product.price.toLocaleString()} تومان
          </span>
          {product.oldPrice && product.oldPrice > 0 && (
            <span className="text-sm text-text-light line-through">
              {product.oldPrice.toLocaleString()} تومان
            </span>
          )}
        </div>
        
        {/* دکمه‌های نرم */}
        <div className="flex gap-2 justify-center">
          <SoftButton
            size="small"
            variant="primary"
            onClick={() => onAddToCart?.(product)}
          >
            🧸 افزودن به سبد
          </SoftButton>
          
          <SoftButton
            size="small"
            variant="outline"
            onClick={() => window.location.href = `/product/${product.id}`}
          >
            👀 مشاهده
          </SoftButton>
        </div>
      </div>
      
      {/* انیمیشن قلب شناور */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-2xl animate-float">🧸</span>
      </div>
    </div>
  );
};

export default ProductCard;