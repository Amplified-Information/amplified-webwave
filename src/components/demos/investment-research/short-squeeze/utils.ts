
import type { StockData } from "./types";

export const calculateRSI = (prices: number[]): number => {
  if (prices.length < 14) return 0;
  
  const changes = prices.slice(1).map((price, index) => price - prices[index]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);
  
  const avgGain = gains.slice(0, 14).reduce((a, b) => a + b) / 14;
  const avgLoss = losses.slice(0, 14).reduce((a, b) => a + b) / 14;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const calculateShortSqueezePotential = (data: StockData): string => {
  if (!data.short_percent_float || !data.relative_volume || !data.rsi) {
    return "Insufficient data";
  }

  let score = 0;
  
  // Short Interest Score (max 3 points)
  if (data.short_percent_float > 30) score += 3;
  else if (data.short_percent_float > 20) score += 2;
  else if (data.short_percent_float > 10) score += 1;

  // Volume Analysis (max 3 points)
  if (data.relative_volume > 2) score += 3;
  else if (data.relative_volume > 1.5) score += 2;
  else if (data.relative_volume > 1.2) score += 1;

  // Technical Strength (max 3 points)
  if (data.rsi > 70) score += 3;
  else if (data.rsi > 60) score += 2;
  else if (data.rsi > 50) score += 1;

  // Price Momentum (max 1 point)
  if (data.price_change_percent && data.price_change_percent > 5) score += 1;

  // Convert score to rating
  if (score >= 8) return "Very High";
  if (score >= 6) return "High";
  if (score >= 4) return "Medium";
  return "Low";
};
