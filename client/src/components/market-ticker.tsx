import { useMarketData } from '@/hooks/use-trading-data';

export function MarketTicker() {
  const { data: marketData = [] } = useMarketData();

  return (
    <div className="bg-trading-darker border-t border-border py-3 overflow-hidden">
      <div className="ticker-scroll flex space-x-12 whitespace-nowrap">
        {marketData.concat(marketData).map((ticker, index) => (
          <div key={`${ticker.symbol}-${index}`} className="flex items-center space-x-3 px-4 py-1 bg-muted/30 rounded-lg backdrop-blur-sm">
            <span className="font-mono text-sm font-semibold text-white">{ticker.symbol}</span>
            <span className={`font-mono text-sm font-bold ${ticker.change >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
              ${ticker.price.toFixed(2)}
            </span>
            <span className={`font-mono text-xs px-2 py-1 rounded ${
              ticker.change >= 0 
                ? 'bg-trading-profit/20 text-trading-profit' 
                : 'bg-trading-loss/20 text-trading-loss'
            }`}>
              {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
