import { TradingCard } from './ui/trading-card';
import { usePortfolio } from '@/hooks/use-trading-data';
import { BarChart3, Target, Bell, Shield } from 'lucide-react';

export function StatsCards() {
  const { data: portfolioData } = usePortfolio();

  if (!portfolioData) return null;

  const activeTrades = portfolioData.positions.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <TradingCard glow="profit" variant="gradient">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Active Trades</h3>
          <div className="p-2 bg-trading-profit/20 rounded-lg">
            <BarChart3 className="w-5 h-5 text-trading-profit" />
          </div>
        </div>
        <div className="font-mono text-3xl font-bold text-white mb-2" data-testid="text-active-trades">{activeTrades}</div>
        <div className="text-sm text-trading-profit flex items-center">
          <span className="text-xs mr-1">↗</span>
          +3 from yesterday
        </div>
      </TradingCard>

      <TradingCard glow="accent">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
          <div className="p-2 bg-primary/20 rounded-lg">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="font-mono text-3xl font-bold text-white mb-2" data-testid="text-success-rate">68.5%</div>
        <div className="text-sm text-trading-profit flex items-center">
          <span className="text-xs mr-1">↗</span>
          +2.1% this week
        </div>
      </TradingCard>

      <TradingCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Signals Generated</h3>
          <div className="p-2 bg-trading-accent/20 rounded-lg">
            <Bell className="w-5 h-5 text-trading-accent animate-pulse-blue" />
          </div>
        </div>
        <div className="font-mono text-3xl font-bold text-white mb-2" data-testid="text-signals-generated">847</div>
        <div className="text-sm text-trading-accent">
          23 in last hour
        </div>
      </TradingCard>

      <TradingCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Risk Score</h3>
          <div className="p-2 bg-orange-400/20 rounded-lg">
            <Shield className="w-5 h-5 text-orange-400" />
          </div>
        </div>
        <div className="font-mono text-3xl font-bold text-white mb-2" data-testid="text-risk-score">Medium</div>
        <div className="text-sm text-orange-400">
          Portfolio risk level
        </div>
      </TradingCard>
    </div>
  );
}
