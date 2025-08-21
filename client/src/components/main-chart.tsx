import { useState, useEffect } from 'react';
import { TradingCard } from './ui/trading-card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMarketData } from '@/hooks/use-trading-data';
import { calculateRSI, calculateMACD, calculateMovingAverage } from '@/services/technical-indicators';

interface ChartData {
  time: string;
  price: number;
}

export function MainChart() {
  const { data: marketData = [] } = useMarketData();
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [indicators, setIndicators] = useState({ rsi: 0, macd: 0, ma20: 0 });

  // Generate mock historical data
  useEffect(() => {
    const currentData = marketData.find(d => d.symbol === selectedSymbol);
    if (!currentData) return;

    const basePrice = currentData.price;
    const data: ChartData[] = [];
    const prices: number[] = [];
    
    // Generate 50 data points
    for (let i = 49; i >= 0; i--) {
      const time = new Date();
      time.setMinutes(time.getMinutes() - i);
      const volatility = 0.02;
      const price = basePrice * (1 + (Math.random() - 0.5) * volatility);
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: Number(price.toFixed(2))
      });
      prices.push(price);
    }

    setChartData(data);

    // Calculate technical indicators
    const rsi = calculateRSI(prices);
    const macd = calculateMACD(prices);
    const ma20 = calculateMovingAverage(prices, 20);

    setIndicators({
      rsi: Number(rsi.toFixed(2)),
      macd: Number(macd.toFixed(2)),
      ma20: Number(ma20.toFixed(2))
    });
  }, [marketData, selectedSymbol]);

  const currentData = marketData.find(d => d.symbol === selectedSymbol);
  if (!currentData) return null;

  return (
    <div className="lg:col-span-2">
      <TradingCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {selectedSymbol} - {selectedSymbol === 'AAPL' ? 'Apple Inc.' : 'Stock'}
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`font-mono text-lg ${currentData.change >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                ${currentData.price.toFixed(2)}
              </span>
              <span className={`font-mono text-sm ${currentData.change >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                {currentData.change >= 0 ? '+' : ''}${currentData.change.toFixed(2)} ({currentData.change >= 0 ? '+' : ''}{currentData.changePercent.toFixed(2)}%)
              </span>
              <span className="text-xs text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {['1D', '1W', '1M', '1Y'].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                data-testid={`button-timeframe-${tf}`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-96 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(217, 91%, 60%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">RSI (14)</div>
            <div className={`font-mono text-sm ${indicators.rsi > 70 ? 'text-trading-loss' : indicators.rsi < 30 ? 'text-trading-profit' : 'text-yellow-400'}`}>
              {indicators.rsi}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">MACD</div>
            <div className={`font-mono text-sm ${indicators.macd >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
              {indicators.macd >= 0 ? '+' : ''}{indicators.macd}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">MA (20)</div>
            <div className="font-mono text-sm text-white">
              ${indicators.ma20}
            </div>
          </div>
        </div>
      </TradingCard>
    </div>
  );
}
