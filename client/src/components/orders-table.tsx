import { TradingCard } from './ui/trading-card';
import { Button } from './ui/button';
import { usePortfolio } from '@/hooks/use-trading-data';
import { History } from 'lucide-react';

// Mock recent orders data
const mockOrders = [
  {
    id: '1',
    symbol: 'AAPL',
    side: 'BUY' as const,
    quantity: 100,
    price: 174.52,
    status: 'FILLED' as const,
    createdAt: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
  },
  {
    id: '2',
    symbol: 'GOOGL',
    side: 'SELL' as const,
    quantity: 25,
    price: 2850.00,
    status: 'PENDING' as const,
    createdAt: new Date(Date.now() - 180000).toISOString() // 3 minutes ago
  },
  {
    id: '3',
    symbol: 'MSFT',
    side: 'BUY' as const,
    quantity: 75,
    price: 378.45,
    status: 'FILLED' as const,
    createdAt: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
  }
];

export function OrdersTable() {
  const { data: portfolioData } = usePortfolio();

  // Use mock data for now since we don't have order history in the storage
  const orders = portfolioData?.orders.length ? portfolioData.orders : mockOrders;

  return (
    <TradingCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
          <History className="w-4 h-4 mr-1" />
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 3).map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                order.status === 'FILLED' ? 'bg-trading-profit' :
                order.status === 'PENDING' ? 'bg-yellow-400 animate-pulse' :
                'bg-trading-loss'
              }`}></div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-medium text-white">{order.symbol}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.side === 'BUY' ? 'bg-trading-profit text-white' : 'bg-trading-loss text-white'
                  }`}>
                    {order.side}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {order.quantity} @ ${order.price?.toFixed(2) || 'Market'} - {order.status}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={`font-mono text-xs ${
                order.status === 'FILLED' ? 'text-trading-profit' :
                order.status === 'PENDING' ? 'text-yellow-400' :
                'text-trading-loss'
              }`}>
                {order.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </TradingCard>
  );
}
