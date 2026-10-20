import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../entities/Category';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | null>;
  getBySlug(slug: string): Promise<Category | null>;
  getMainCategories(): Promise<Category[]>;
  create(category: CreateCategoryDto): Promise<Category>;
  update(category: UpdateCategoryDto): Promise<Category>;
  delete(id: number): Promise<void>;
}