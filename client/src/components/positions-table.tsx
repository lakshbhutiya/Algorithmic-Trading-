import { TradingCard } from './ui/trading-card';
import { Button } from './ui/button';
import { usePortfolio } from '@/hooks/use-trading-data';
import { ExternalLink, X } from 'lucide-react';

export function PositionsTable() {
  const { data: portfolioData } = usePortfolio();

  if (!portfolioData?.positions.length) {
    return (
      <TradingCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Active Positions</h3>
        </div>
        <div className="text-center text-gray-400 py-8">
          No active positions
        </div>
      </TradingCard>
    );
  }

  const positions = portfolioData.positions;

  return (
    <TradingCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Active Positions</h3>
        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
          <ExternalLink className="w-4 h-4 mr-1" />
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {positions.map((position) => {
          const pl = parseFloat(position.unrealizedPL);
          const plPercent = (pl / (position.quantity * parseFloat(position.avgPrice))) * 100;
          
          return (
            <div key={position.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  position.symbol === 'AAPL' ? 'bg-blue-500' :
                  position.symbol === 'GOOGL' ? 'bg-red-500' :
                  position.symbol === 'TSLA' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}>
                  <span className="text-xs font-bold text-white">
                    {position.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-mono text-sm font-medium text-white">{position.symbol}</div>
                  <div className="text-xs text-gray-400">{position.quantity} shares</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-mono text-sm ${pl >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                  {pl >= 0 ? '+' : ''}${Math.abs(pl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-xs ${pl >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                  {pl >= 0 ? '+' : ''}{plPercent.toFixed(2)}%
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 p-1"
                  data-testid={`button-close-${position.symbol}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </TradingCard>
  );
}
