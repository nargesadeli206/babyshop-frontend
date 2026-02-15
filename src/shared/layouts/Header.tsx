// src/shared/layouts/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SoftButton from '../components/Button/SoftButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white-warm shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* لوگو با انیمیشن */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-4xl transform transition-transform group-hover:scale-110 group-hover:rotate-12">
              🧸
            </span>
            <span className="font-playful text-2xl text-primary-warm">
              BabyShop
            </span>
            <span className="text-3xl animate-bounce-slow">
              ✨
            </span>
          </Link>
          
          {/* منوی اصلی */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-soft text-text-soft hover:text-primary-warm transition-colors relative group">
              خانه
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-warm transition-all group-hover:w-full" />
            </Link>
            <Link to="/products" className="font-soft text-text-soft hover:text-primary-warm transition-colors relative group">
              محصولات
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-warm transition-all group-hover:w-full" />
            </Link>
            <Link to="/categories" className="font-soft text-text-soft hover:text-primary-warm transition-colors relative group">
              دسته‌بندی‌ها
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-warm transition-all group-hover:w-full" />
            </Link>
            <Link to="/about" className="font-soft text-text-soft hover:text-primary-warm transition-colors relative group">
              درباره ما
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-warm transition-all group-hover:w-full" />
            </Link>
          </nav>
          
          {/* دکمه‌های کاربری */}
          <div className="flex items-center gap-3">
            <SoftButton size="small" variant="outline">
              🛒 سبد خرید
            </SoftButton>
            <SoftButton size="small" variant="primary">
              👤 ورود
            </SoftButton>
            
            {/* منوی موبایل */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-soft hover:bg-primary-soft transition-colors"
            >
              <span className="text-2xl">
                {isMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>
        
        {/* منوی کشویی موبایل */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-secondary-cream rounded-soft animate-fadeIn">
            <nav className="flex flex-col gap-3">
              <Link to="/" className="font-soft text-text-soft hover:text-primary-warm py-2">
                🏠 خانه
              </Link>
              <Link to="/products" className="font-soft text-text-soft hover:text-primary-warm py-2">
                🧸 محصولات
              </Link>
              <Link to="/categories" className="font-soft text-text-soft hover:text-primary-warm py-2">
                📚 دسته‌بندی‌ها
              </Link>
              <Link to="/about" className="font-soft text-text-soft hover:text-primary-warm py-2">
                💝 درباره ما
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;