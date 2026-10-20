import type { Inventory, UpdateInventoryDto } from '../entities/Inventory';

export interface IInventoryRepository {
  getByProductId(productId: number): Promise<Inventory | null>;
  getAll(): Promise<Inventory[]>;
  getLowStock(): Promise<Inventory[]>;
  create(inventory: any): Promise<Inventory>;
  increaseStock(dto: UpdateInventoryDto): Promise<Inventory>;
  decreaseStock(dto: UpdateInventoryDto): Promise<Inventory>;
}