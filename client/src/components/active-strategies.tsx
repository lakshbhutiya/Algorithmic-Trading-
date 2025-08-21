import { useStrategies } from '@/hooks/use-trading-data';
import { TradingCard } from './ui/trading-card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

export function ActiveStrategies() {
  const { data: strategies = [] } = useStrategies();

  return (
    <div className="p-6 border-b border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Active Strategies</h3>
        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {strategies.map((strategy) => (
          <TradingCard key={strategy.id} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{strategy.name}</span>
              <div className={`w-2 h-2 rounded-full ${strategy.isActive ? 'bg-trading-profit' : 'bg-gray-400'}`}></div>
            </div>
            <div className="text-xs text-gray-400 mb-1">{strategy.symbols.join(', ')}</div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">P&L:</span>
              <span className={`font-mono ${parseFloat(strategy.totalPL) >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                {parseFloat(strategy.totalPL) >= 0 ? '+' : ''}${Math.abs(parseFloat(strategy.totalPL)).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </TradingCard>
        ))}
      </div>
    </div>
  );
}
