import { apiRequest } from '@/lib/queryClient';

export interface CreateOrderRequest {
  portfolioId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price?: number;
}

export interface GenerateSignalRequest {
  symbol: string;
  strategy?: string;
}

export async function createOrder(orderData: CreateOrderRequest) {
  const response = await apiRequest('POST', '/api/orders', orderData);
  return response.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const response = await apiRequest('PATCH', `/api/orders/${orderId}`, { status });
  return response.json();
}

export async function generateSignal(signalData: GenerateSignalRequest) {
  const response = await apiRequest('POST', '/api/signals/generate', signalData);
  return response.json();
}
