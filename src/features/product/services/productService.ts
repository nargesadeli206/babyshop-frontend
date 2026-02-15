// src/features/product/services/productService.ts
import axios from 'axios';
import { ProductDto, ApiResponse } from '../../../core/interfaces';

// استفاده از متغیر محیطی با fallback
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5191';

export const productService = {
  async getAllProducts(): Promise<ProductDto[]> {
    try {
      const response = await axios.get<ApiResponse<ProductDto[]>>(`${API_URL}/api/product`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  async getProductById(id: number): Promise<ProductDto | null> {
    try {
      const response = await axios.get<ApiResponse<ProductDto>>(`${API_URL}/api/product/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  
  async getProductsByCategory(categoryId: number): Promise<ProductDto[]> {
    try {
      const response = await axios.get<ApiResponse<ProductDto[]>>(`${API_URL}/api/product/category/${categoryId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },
  
  async searchProducts(term: string): Promise<ProductDto[]> {
    try {
      const response = await axios.get<ApiResponse<ProductDto[]>>(`${API_URL}/api/product/search`, {
        params: { term }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
};