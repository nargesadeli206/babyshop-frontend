export interface Order {
  id: number;
  userId: number;
  orderDate: Date;
  status: number;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  paymentStatus: number;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderDto {
  userId: number;
  shippingAddress: string;
  items: OrderItemDto[];
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
}

export interface OrderSummaryDto {
  id: number;
  orderDate: Date;
  status: number;
  totalAmount: number;
  itemCount: number;
}