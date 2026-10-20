export interface Delivery {
  id: number;
  orderId: number;
  trackingCode: string;
  carrier: string;
  status: number;  // DeliveryStatus
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
}

export const DeliveryStatus = {
  Pending: 0,
  Processing: 1,
  InTransit: 2,
  OutForDelivery: 3,
  Delivered: 4,
  Failed: 5
} as const;

export interface UpdateDeliveryStatusDto {
  deliveryId: number;
  status: number;
}