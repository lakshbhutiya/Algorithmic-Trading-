import { useMarketData } from '@/hooks/use-trading-data';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

export function Watchlist() {
  const { data: marketData = [] } = useMarketData();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Watchlist</h3>
        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
          <Search className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {marketData.slice(0, 4).map((item) => (
          <div 
            key={item.symbol}
            className="flex items-center justify-between py-2 hover:bg-gray-700 rounded px-2 cursor-pointer transition-colors"
            data-testid={`watchlist-item-${item.symbol}`}
          >
            <div>
              <div className="font-mono text-sm font-medium text-white">{item.symbol}</div>
              <div className="text-xs text-gray-400">
                {item.symbol === 'AAPL' && 'Apple Inc.'}
                {item.symbol === 'GOOGL' && 'Alphabet Inc.'}
                {item.symbol === 'TSLA' && 'Tesla Inc.'}
                {item.symbol === 'BTC' && 'Bitcoin'}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-mono text-sm ${item.change >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                ${item.price.toFixed(2)}
              </div>
              <div className={`text-xs ${item.change >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
