export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculate RSI for remaining periods
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export function calculateMovingAverage(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  
  const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
  return sum / period;
}

export function calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26): number {
  const fastMA = calculateMovingAverage(prices, fastPeriod);
  const slowMA = calculateMovingAverage(prices, slowPeriod);
  return fastMA - slowMA;
}

export function calculateBollingerBands(prices: number[], period: number = 20, multiplier: number = 2) {
  const ma = calculateMovingAverage(prices, period);
  
  if (prices.length < period) {
    return { upper: ma, middle: ma, lower: ma };
  }
  
  const recentPrices = prices.slice(-period);
  const variance = recentPrices.reduce((acc, price) => acc + Math.pow(price - ma, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  
  return {
    upper: ma + (stdDev * multiplier),
    middle: ma,
    lower: ma - (stdDev * multiplier)
  };
}
