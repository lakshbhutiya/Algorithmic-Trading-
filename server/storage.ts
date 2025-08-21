import { type User, type InsertUser, type Portfolio, type InsertPortfolio, type Position, type InsertPosition, type Order, type InsertOrder, type Strategy, type InsertStrategy, type Signal, type InsertSignal, type MarketData, type InsertMarketData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Portfolio operations
  getPortfolio(userId: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined>;
  
  // Position operations
  getPositions(portfolioId: string): Promise<Position[]>;
  createPosition(position: InsertPosition): Promise<Position>;
  updatePosition(id: string, updates: Partial<Position>): Promise<Position | undefined>;
  deletePosition(id: string): Promise<boolean>;
  
  // Order operations
  getOrders(portfolioId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  
  // Strategy operations
  getStrategies(): Promise<Strategy[]>;
  createStrategy(strategy: InsertStrategy): Promise<Strategy>;
  updateStrategy(id: string, updates: Partial<Strategy>): Promise<Strategy | undefined>;
  
  // Signal operations
  getRecentSignals(limit: number): Promise<Signal[]>;
  createSignal(signal: InsertSignal): Promise<Signal>;
  
  // Market data operations
  getMarketData(symbols: string[]): Promise<MarketData[]>;
  updateMarketData(data: InsertMarketData): Promise<MarketData>;
  getLatestMarketData(symbol: string): Promise<MarketData | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private positions: Map<string, Position> = new Map();
  private orders: Map<string, Order> = new Map();
  private strategies: Map<string, Strategy> = new Map();
  private signals: Map<string, Signal> = new Map();
  private marketData: Map<string, MarketData[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create default user
    const defaultUser: User = {
      id: "user-1",
      username: "trader",
      password: "password"
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default portfolio
    const defaultPortfolio: Portfolio = {
      id: "portfolio-1",
      userId: defaultUser.id,
      balance: "125430.20",
      totalPL: "8945.30",
      todayPL: "-234.56",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.portfolios.set(defaultPortfolio.id, defaultPortfolio);

    // Create mock positions
    const mockPositions: Position[] = [
      {
        id: "pos-1",
        portfolioId: defaultPortfolio.id,
        symbol: "AAPL",
        quantity: 100,
        avgPrice: "170.50",
        currentPrice: "175.24",
        unrealizedPL: "474.00",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pos-2",
        portfolioId: defaultPortfolio.id,
        symbol: "GOOGL",
        quantity: 25,
        avgPrice: "2880.00",
        currentPrice: "2845.67",
        unrealizedPL: "-858.25",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pos-3",
        portfolioId: defaultPortfolio.id,
        symbol: "TSLA",
        quantity: 50,
        avgPrice: "220.45",
        currentPrice: "234.56",
        unrealizedPL: "705.50",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockPositions.forEach(pos => this.positions.set(pos.id, pos));

    // Create mock strategies
    const mockStrategies: Strategy[] = [
      {
        id: "strat-1",
        name: "Trend Following",
        type: "TREND_FOLLOWING",
        symbols: ["AAPL", "GOOGL", "MSFT"],
        parameters: { period: 20, threshold: 0.02 },
        isActive: true,
        totalPL: "1234.56",
        createdAt: new Date()
      },
      {
        id: "strat-2",
        name: "Mean Reversion",
        type: "MEAN_REVERSION",
        symbols: ["SPY", "QQQ"],
        parameters: { rsi_period: 14, bb_period: 20 },
        isActive: true,
        totalPL: "-89.45",
        createdAt: new Date()
      }
    ];

    mockStrategies.forEach(strat => this.strategies.set(strat.id, strat));

    // Create mock market data
    const mockSymbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "BTC"];
    const mockPrices = [175.24, 2845.67, 378.92, 234.56, 3234.78, 43567.89];
    const mockChanges = [4.12, -35.23, 3.34, -8.45, 54.23, 1842.45];

    mockSymbols.forEach((symbol, index) => {
      const data: MarketData = {
        id: randomUUID(),
        symbol,
        price: mockPrices[index].toString(),
        change: mockChanges[index].toString(),
        changePercent: ((mockChanges[index] / (mockPrices[index] - mockChanges[index])) * 100).toFixed(2),
        volume: Math.floor(Math.random() * 1000000) + 500000,
        timestamp: new Date()
      };
      
      if (!this.marketData.has(symbol)) {
        this.marketData.set(symbol, []);
      }
      this.marketData.get(symbol)!.push(data);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfolio(userId: string): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(p => p.userId === userId);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = {
      ...insertPortfolio,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;
    
    const updated = { ...portfolio, ...updates, updatedAt: new Date() };
    this.portfolios.set(id, updated);
    return updated;
  }

  async getPositions(portfolioId: string): Promise<Position[]> {
    return Array.from(this.positions.values()).filter(p => p.portfolioId === portfolioId);
  }

  async createPosition(insertPosition: InsertPosition): Promise<Position> {
    const id = randomUUID();
    const position: Position = {
      ...insertPosition,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.positions.set(id, position);
    return position;
  }

  async updatePosition(id: string, updates: Partial<Position>): Promise<Position | undefined> {
    const position = this.positions.get(id);
    if (!position) return undefined;
    
    const updated = { ...position, ...updates, updatedAt: new Date() };
    this.positions.set(id, updated);
    return updated;
  }

  async deletePosition(id: string): Promise<boolean> {
    return this.positions.delete(id);
  }

  async getOrders(portfolioId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(o => o.portfolioId === portfolioId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  async getStrategies(): Promise<Strategy[]> {
    return Array.from(this.strategies.values());
  }

  async createStrategy(insertStrategy: InsertStrategy): Promise<Strategy> {
    const id = randomUUID();
    const strategy: Strategy = {
      ...insertStrategy,
      id,
      createdAt: new Date()
    };
    this.strategies.set(id, strategy);
    return strategy;
  }

  async updateStrategy(id: string, updates: Partial<Strategy>): Promise<Strategy | undefined> {
    const strategy = this.strategies.get(id);
    if (!strategy) return undefined;
    
    const updated = { ...strategy, ...updates };
    this.strategies.set(id, updated);
    return updated;
  }

  async getRecentSignals(limit: number): Promise<Signal[]> {
    return Array.from(this.signals.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async createSignal(insertSignal: InsertSignal): Promise<Signal> {
    const id = randomUUID();
    const signal: Signal = {
      ...insertSignal,
      id,
      createdAt: new Date()
    };
    this.signals.set(id, signal);
    return signal;
  }

  async getMarketData(symbols: string[]): Promise<MarketData[]> {
    const result: MarketData[] = [];
    for (const symbol of symbols) {
      const data = this.marketData.get(symbol);
      if (data && data.length > 0) {
        result.push(data[data.length - 1]); // Get latest data
      }
    }
    return result;
  }

  async updateMarketData(insertData: InsertMarketData): Promise<MarketData> {
    const id = randomUUID();
    const data: MarketData = {
      ...insertData,
      id,
      timestamp: new Date()
    };
    
    if (!this.marketData.has(insertData.symbol)) {
      this.marketData.set(insertData.symbol, []);
    }
    this.marketData.get(insertData.symbol)!.push(data);
    return data;
  }

  async getLatestMarketData(symbol: string): Promise<MarketData | undefined> {
    const data = this.marketData.get(symbol);
    return data && data.length > 0 ? data[data.length - 1] : undefined;
  }
}

export const storage = new MemStorage();
