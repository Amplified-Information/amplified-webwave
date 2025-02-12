
export interface ScreenerData {
  symbol: string;
  company_name: string | null;
  sector: string | null;
  market_cap: number | null;
  pe_ratio: number | null;
  price_to_book: number | null;
  dividend_yield: number | null;
  fifty_day_ma: number | null;
  two_hundred_day_ma: number | null;
  year_high: number | null;
  year_low: number | null;
  volume: number | null;
  avg_volume: number | null;
}
