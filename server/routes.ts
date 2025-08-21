import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertOrderSchema, insertSignalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store connected clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to trading server'
    }));
  });

  // Broadcast to all connected clients
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // API Routes
  
  // Get portfolio data
  app.get('/api/portfolio/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const portfolio = await storage.getPortfolio(userId);
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const positions = await storage.getPositions(portfolio.id);
      const orders = await storage.getOrders(portfolio.id);

      res.json({
        portfolio,
        positions,
        orders
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
  });

  // Get market data
  app.get('/api/market-data', async (req, res) => {
    try {
      const symbols = req.query.symbols as string;
      const symbolArray = symbols ? symbols.split(',') : ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'BTC'];
      
      const marketData = await storage.getMarketData(symbolArray);
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch market data' });
    }
  });

  // Get strategies
  app.get('/api/strategies', async (req, res) => {
    try {
      const strategies = await storage.getStrategies();
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch strategies' });
    }
  });

  // Get recent signals
  app.get('/api/signals', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const signals = await storage.getRecentSignals(limit);
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch signals' });
    }
  });

  // Create order
  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Broadcast order update
      broadcast({
        type: 'order_created',
        data: order
      });

      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid order data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // Update order status (simulate order execution)
  app.patch('/api/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const order = await storage.updateOrder(id, { status });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Broadcast order update
      broadcast({
        type: 'order_updated',
        data: order
      });

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  // Generate trading signals (simulate algorithmic strategy)
  app.post('/api/signals/generate', async (req, res) => {
    try {
      const { symbol, strategy } = req.body;
      
      // Simple signal generation logic (mock implementation)
      const marketData = await storage.getLatestMarketData(symbol);
      if (!marketData) {
        return res.status(404).json({ error: 'Market data not found for symbol' });
      }

      const price = parseFloat(marketData.price);
      const change = parseFloat(marketData.change);
      
      // Simple trend-following logic
      let signalType: 'BUY' | 'SELL' = change > 0 ? 'BUY' : 'SELL';
      let confidence = Math.min(Math.abs(change) / price * 10, 1); // Scale confidence

      const signalData = {
        symbol,
        type: signalType,
        price: price.toString(),
        confidence: confidence.toString(),
        strategy: strategy || 'TREND_FOLLOWING'
      };

      const signal = await storage.createSignal(signalData);

      // Broadcast signal
      broadcast({
        type: 'signal_generated',
        data: signal
      });

      res.json(signal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate signal' });
    }
  });

  // Simulate real-time market data updates
  setInterval(async () => {
    try {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'BTC'];
      
      for (const symbol of symbols) {
        const currentData = await storage.getLatestMarketData(symbol);
        if (currentData) {
          const currentPrice = parseFloat(currentData.price);
          const volatility = symbol === 'BTC' ? 0.02 : 0.01;
          const priceChange = (Math.random() - 0.5) * currentPrice * volatility;
          const newPrice = Math.max(0.01, currentPrice + priceChange);
          const change = newPrice - currentPrice;
          const changePercent = (change / currentPrice) * 100;

          const updatedData = {
            symbol,
            price: newPrice.toFixed(2),
            change: change.toFixed(2),
            changePercent: changePercent.toFixed(2),
            volume: Math.floor(Math.random() * 500000) + 500000
          };

          await storage.updateMarketData(updatedData);

          // Broadcast market update
          broadcast({
            type: 'market_update',
            data: updatedData
          });
        }
      }
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  }, 5000); // Update every 5 seconds

  return httpServer;
}
