
export interface StockData {
  symbol: string;
  company_name: string | null;
  current_price: number | null;
  previous_close: number | null;
  volume: number | null;
  avg_volume: number | null;
  fifty_day_ma: number | null;
  two_hundred_day_ma: number | null;
  year_high: number | null;
  short_percent_float?: number | null;
  relative_volume?: number | null;
  price_change_percent?: number | null;
  rsi?: number | null;
}
