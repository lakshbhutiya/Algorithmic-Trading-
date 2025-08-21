import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { TradingCard } from './ui/trading-card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSignals, usePortfolio } from '@/hooks/use-trading-data';
import { createOrder } from '@/services/trading-api';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function TradePanel() {
  const { toast } = useToast();
  const { data: portfolioData } = usePortfolio();
  const { data: signals = [] } = useSignals(5);
  
  const [orderForm, setOrderForm] = useState({
    symbol: 'AAPL',
    quantity: 100,
    orderType: 'MARKET',
    price: 175.24
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast({
        title: "Order Submitted",
        description: "Your order has been successfully submitted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleOrder = (side: 'BUY' | 'SELL') => {
    if (!portfolioData?.portfolio) return;

    createOrderMutation.mutate({
      portfolioId: portfolioData.portfolio.id,
      symbol: orderForm.symbol,
      side,
      orderType: orderForm.orderType as 'MARKET' | 'LIMIT' | 'STOP',
      quantity: orderForm.quantity,
      price: orderForm.orderType !== 'MARKET' ? orderForm.price : undefined
    });
  };

  const estimatedCost = orderForm.quantity * orderForm.price;

  return (
    <TradingCard variant="gradient">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Quick Trade</h3>
        <div className="w-2 h-2 bg-trading-accent rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="block text-xs text-gray-400 mb-1">Symbol</Label>
          <Input
            type="text"
            value={orderForm.symbol}
            onChange={(e) => setOrderForm({ ...orderForm, symbol: e.target.value.toUpperCase() })}
            className="font-mono"
            data-testid="input-symbol"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="block text-xs text-gray-400 mb-1">Quantity</Label>
            <Input
              type="number"
              value={orderForm.quantity}
              onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 0 })}
              className="font-mono"
              data-testid="input-quantity"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-400 mb-1">Order Type</Label>
            <Select
              value={orderForm.orderType}
              onValueChange={(value) => setOrderForm({ ...orderForm, orderType: value })}
            >
              <SelectTrigger className="font-mono" data-testid="select-order-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MARKET">Market</SelectItem>
                <SelectItem value="LIMIT">Limit</SelectItem>
                <SelectItem value="STOP">Stop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="block text-xs text-gray-400 mb-1">Price</Label>
          <Input
            type="number"
            step="0.01"
            value={orderForm.price}
            onChange={(e) => setOrderForm({ ...orderForm, price: parseFloat(e.target.value) || 0 })}
            disabled={orderForm.orderType === 'MARKET'}
            className="font-mono"
            data-testid="input-price"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleOrder('BUY')}
            disabled={createOrderMutation.isPending}
            className="bg-trading-profit hover:bg-trading-profit/80 text-white font-semibold"
            data-testid="button-buy"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Buy
          </Button>
          <Button
            onClick={() => handleOrder('SELL')}
            disabled={createOrderMutation.isPending}
            className="bg-trading-loss hover:bg-trading-loss/80 text-white font-semibold"
            data-testid="button-sell"
          >
            <ArrowDown className="w-4 h-4 mr-2" />
            Sell
          </Button>
        </div>

        <div className="text-xs text-gray-400 text-center">
          Estimated Cost: <span className="font-mono text-white">${estimatedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-semibold text-white mb-3">Recent Signals</h4>
        <div className="space-y-2">
          {signals.slice(0, 3).map((signal) => (
            <div key={signal.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
              <div className="flex items-center space-x-2">
                {signal.type === 'BUY' ? (
                  <ArrowUp className="w-3 h-3 text-trading-profit" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-trading-loss" />
                )}
                <span className="font-mono text-xs text-white">{signal.symbol}</span>
              </div>
              <div className="text-right">
                <div className={`text-xs ${signal.type === 'BUY' ? 'text-trading-profit' : 'text-trading-loss'}`}>
                  {signal.type}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(signal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TradingCard>
  );
}
