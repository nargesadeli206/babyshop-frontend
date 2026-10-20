export interface Inventory {
  id: number;
  productId: number;
  productName?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  lastUpdated: Date;
}

export interface UpdateInventoryDto {
  productId: number;
  quantity: number;
}