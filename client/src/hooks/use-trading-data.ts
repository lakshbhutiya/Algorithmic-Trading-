import { useQuery } from '@tanstack/react-query';
import { MarketDataPoint, Portfolio, Strategy, TradingSignal } from '@/types/trading';

export function usePortfolio(userId: string = 'user-1') {
  return useQuery<Portfolio>({
    queryKey: ['/api/portfolio', userId],
  });
}

export function useMarketData(symbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'BTC']) {
  return useQuery<MarketDataPoint[]>({
    queryKey: ['/api/market-data', symbols.join(',')],
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

export function useStrategies() {
  return useQuery<Strategy[]>({
    queryKey: ['/api/strategies'],
  });
}

export function useSignals(limit: number = 10) {
  return useQuery<TradingSignal[]>({
    queryKey: ['/api/signals'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}
