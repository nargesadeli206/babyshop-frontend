import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  wishlist: any[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ۱. مقداردهی اولیه رو مستقیم از localStorage می‌خونیم تا با رفرش نپره!
  const [wishlist, setWishlist] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ziizii_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ۲. هر بار که لیست تغییر کرد، سریعاً تو localStorage آپدیتش می‌کنیم
  useEffect(() => {
    localStorage.setItem('ziizii_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: any) => {
    setWishlist(prev => {
      // استفاده از Number() برای جلوگیری از باگ تفاوت تایپِ string و int
      const exists = prev.find(item => Number(item.id) === Number(product.id));
      if (exists) {
        // حذف از لیست
        return prev.filter(item => Number(item.id) !== Number(product.id));
      }
      // اضافه به لیست
      return [...prev, product];
    });
  };

  const isInWishlist = (id: number | string) => {
    return wishlist.some(item => Number(item.id) === Number(id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('باید داخل WishlistProvider استفاده شود');
  return context;
};