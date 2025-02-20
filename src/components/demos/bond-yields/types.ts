
export interface BondData {
  date: string;
  yield_2yr: number;
  yield_5yr: number;
  yield_10yr: number;
  yield_30yr: number;
}

export interface BondSeries {
  id: keyof Omit<BondData, 'date'>;
  name: string;
  color: string;
  visible: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface BondYieldsFilters {
  dateRange: DateRange;
  showWeeklyAverage: boolean;
  timeRangeOption: 'all' | '1y' | '6m' | '3m' | '1m';
}
