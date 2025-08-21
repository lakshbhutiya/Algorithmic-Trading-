import { usePortfolio } from '@/hooks/use-trading-data';
import { TradingCard } from './ui/trading-card';

export function PortfolioOverview() {
  const { data: portfolioData } = usePortfolio();

  if (!portfolioData) return null;

  const { portfolio, positions } = portfolioData;
  const activePositions = positions.length;
  const winRate = 68.5; // Mock calculation

  return (
    <div className="p-6 border-b border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Portfolio Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <TradingCard className="p-4" glow={parseFloat(portfolio.totalPL) >= 0 ? 'profit' : 'loss'}>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Total P&L</div>
          <div className={`font-mono text-lg font-semibold ${parseFloat(portfolio.totalPL) >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
            {parseFloat(portfolio.totalPL) >= 0 ? '+' : ''}${Math.abs(parseFloat(portfolio.totalPL)).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
          <div className={`text-xs ${parseFloat(portfolio.totalPL) >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
            +7.13%
          </div>
        </TradingCard>
        
        <TradingCard className="p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Today's P&L</div>
          <div className={`font-mono text-lg font-semibold ${parseFloat(portfolio.todayPL) >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
            {parseFloat(portfolio.todayPL) >= 0 ? '+' : ''}${Math.abs(parseFloat(portfolio.todayPL)).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
          <div className={`text-xs ${parseFloat(portfolio.todayPL) >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
            -0.19%
          </div>
        </TradingCard>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Active Positions</span>
          <span className="font-mono text-white">{activePositions}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Open Orders</span>
          <span className="font-mono text-white">3</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Win Rate</span>
          <span className="font-mono text-trading-profit">{winRate}%</span>
        </div>
      </div>
    </div>
  );
}
