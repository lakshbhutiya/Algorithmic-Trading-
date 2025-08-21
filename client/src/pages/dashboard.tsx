import { useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { MarketTicker } from '@/components/market-ticker';
import { PortfolioOverview } from '@/components/portfolio-overview';
import { ActiveStrategies } from '@/components/active-strategies';
import { Watchlist } from '@/components/watchlist';
import { StatsCards } from '@/components/stats-cards';
import { MainChart } from '@/components/main-chart';
import { TradePanel } from '@/components/trade-panel';
import { PositionsTable } from '@/components/positions-table';
import { OrdersTable } from '@/components/orders-table';
import { PerformanceAnalytics } from '@/components/performance-analytics';
import { ChartLine, User } from 'lucide-react';

export default function Dashboard() {
  const { isConnected, lastMessage } = useWebSocket();
  const { toast } = useToast();

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'market_update':
          // Invalidate market data queries to refresh with new data
          queryClient.invalidateQueries({ queryKey: ['/api/market-data'] });
          break;
        case 'signal_generated':
          // Invalidate signals query
          queryClient.invalidateQueries({ queryKey: ['/api/signals'] });
          toast({
            title: "New Trading Signal",
            description: `${lastMessage.data.type} signal for ${lastMessage.data.symbol}`,
          });
          break;
        case 'order_updated':
          // Invalidate portfolio data
          queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
          break;
      }
    }
  }, [lastMessage, toast]);

  return (
    <div className="bg-trading-dark text-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-trading-slate border-b border-border sticky top-0 z-50 glass-effect">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-trading-accent rounded-xl flex items-center justify-center shadow-lg">
                <ChartLine className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AlgoTrade Pro</h1>
                <div className="text-xs text-trading-accent">Real-time Trading Platform</div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-primary hover:text-trading-accent font-medium transition-colors">Dashboard</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Strategies</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Backtest</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Analytics</a>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-trading-profit animate-pulse-green' : 'bg-trading-loss'}`}></div>
              <span className="text-sm font-medium">
                {isConnected ? 'Live Market' : 'Disconnected'}
              </span>
            </div>

            <div className="text-right px-4 py-2 rounded-lg bg-trading-profit/10 border border-trading-profit/20">
              <div className="text-xs text-trading-neutral">Account Balance</div>
              <div className="font-mono font-bold text-trading-profit text-lg">$125,430.20</div>
            </div>

            <div className="w-10 h-10 bg-gradient-to-br from-muted to-accent rounded-full flex items-center justify-center shadow-lg hover:shadow-accent-glow transition-all cursor-pointer">
              <User className="text-white w-5 h-5" />
            </div>
          </div>
        </div>

        <MarketTicker />
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-80 bg-trading-slate border-r border-gray-700 overflow-y-auto">
          <PortfolioOverview />
          <ActiveStrategies />
          <Watchlist />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <StatsCards />

          {/* Main Chart and Trade Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <MainChart />
            <TradePanel />
          </div>

          {/* Positions and Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PositionsTable />
            <OrdersTable />
          </div>

          {/* Performance Analytics */}
          <PerformanceAnalytics />
        </main>
      </div>
    </div>
  );
}
