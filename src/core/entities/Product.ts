export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  categoryName?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrl?: string;
}

export interface UpdateProductDto {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  categoryId?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface ProductListDto {
  id: number;
  name: string;
  price: number;
  categoryName: string;
  stockQuantity: number;
  isActive: boolean;
}