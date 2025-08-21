export interface MarketDataPoint {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: number;
  movingAverage20: number;
  bollingerUpper: number;
  bollingerLower: number;
}

export interface ChartDataPoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  confidence: number;
  strategy: string;
  createdAt: string;
}

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPL: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price?: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED';
  createdAt: string;
}

export interface Strategy {
  id: string;
  name: string;
  type: 'TREND_FOLLOWING' | 'MEAN_REVERSION' | 'ARBITRAGE';
  symbols: string[];
  isActive: boolean;
  totalPL: number;
}

export interface Portfolio {
  id: string;
  balance: number;
  totalPL: number;
  todayPL: number;
  positions: Position[];
  orders: Order[];
}
