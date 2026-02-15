// src/core/interfaces/index.ts
export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  imageUrl?: string;
  categoryId: number;
  slug?: string;
  stock?: number;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}