import type { Product, CreateProductDto, UpdateProductDto, ProductListDto } from '../entities/Product';
import type { PagedResult } from './IPagedResult';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  getPaged(pageNumber: number, pageSize: number): Promise<PagedResult<ProductListDto>>;
  create(product: CreateProductDto): Promise<Product>;
  update(product: UpdateProductDto): Promise<Product>;
  delete(id: number): Promise<void>;
  getByCategory(categoryId: number): Promise<Product[]>;
  search(term: string): Promise<Product[]>;
}