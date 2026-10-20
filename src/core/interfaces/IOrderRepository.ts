import type { Order, CreateOrderDto, OrderSummaryDto } from '../entities/Order';
import type { PagedResult } from './IPagedResult';

export interface IOrderRepository {
  getById(id: number): Promise<Order | null>;
  getPaged(pageNumber: number, pageSize: number): Promise<PagedResult<OrderSummaryDto>>;
  getByUser(userId: number): Promise<OrderSummaryDto[]>;
  create(order: CreateOrderDto): Promise<Order>;
  updateStatus(orderId: number, status: number): Promise<Order>;
  cancel(orderId: number, reason: string): Promise<void>;
}