// src/features/product/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { ProductDto } from '../../../core/interfaces';
import { productService } from '../services/productService';

export const useProducts = (categoryId?: number) => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data: ProductDto[];
        
        if (categoryId) {
          data = await productService.getProductsByCategory(categoryId);
        } else {
          data = await productService.getAllProducts();
        }
        
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت محصولات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
};