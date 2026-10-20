export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
}

export interface UpdateCategoryDto {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
  isActive?: boolean;
}