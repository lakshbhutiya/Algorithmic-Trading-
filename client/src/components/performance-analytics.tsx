import { useState } from 'react';
import { TradingCard } from './ui/trading-card';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock performance data
const plData = [
  { name: 'Mon', value: 1200 },
  { name: 'Tue', value: -800 },
  { name: 'Wed', value: 2400 },
  { name: 'Thu', value: 1600 },
  { name: 'Fri', value: -400 },
  { name: 'Sat', value: 3200 },
  { name: 'Sun', value: 2800 }
];

const strategyData = [
  { name: 'Trend Following', value: 7.2, color: 'hsl(142, 76%, 36%)' },
  { name: 'Mean Reversion', value: -1.8, color: 'hsl(0, 84%, 60%)' },
  { name: 'Arbitrage', value: 3.4, color: 'hsl(142, 76%, 36%)' },
  { name: 'Market Timing', value: 5.1, color: 'hsl(142, 76%, 36%)' }
];

const performanceMetrics = {
  sharpeRatio: 1.84,
  maxDrawdown: -8.45,
  alpha: 0.12,
  beta: 0.95
};

export function PerformanceAnalytics() {
  const [timeframe, setTimeframe] = useState('7D');

  return (
    <TradingCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Performance Analytics</h3>
        <div className="flex space-x-2">
          {['7D', '30D', '90D'].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              data-testid={`button-performance-${tf}`}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* P&L Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">Portfolio P&L Over Time</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`, 
                    value >= 0 ? 'Profit' : 'Loss'
                  ]}
                />
                <Bar 
                  dataKey="value" 
                  fill={(entry) => entry >= 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Performance */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">Strategy Performance</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={strategyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {strategyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Return']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Sharpe Ratio</div>
          <div className="font-mono text-lg font-semibold text-white" data-testid="text-sharpe-ratio">
            {performanceMetrics.sharpeRatio}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Max Drawdown</div>
          <div className="font-mono text-lg font-semibold text-trading-loss" data-testid="text-max-drawdown">
            {performanceMetrics.maxDrawdown}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Alpha</div>
          <div className="font-mono text-lg font-semibold text-trading-profit" data-testid="text-alpha">
            {performanceMetrics.alpha}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Beta</div>
          <div className="font-mono text-lg font-semibold text-white" data-testid="text-beta">
            {performanceMetrics.beta}
          </div>
        </div>
      </div>
    </TradingCard>
  );
}
