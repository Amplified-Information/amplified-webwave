
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BondData, DateRange } from "./types";

const calculateWeeklyAverage = (data: BondData[]) => {
  const weeklyData: { [key: string]: BondData[] } = {};
  
  data.forEach(entry => {
    const date = new Date(entry.date);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay())).toISOString().split('T')[0];
    
    if (!weeklyData[weekStart]) {
      weeklyData[weekStart] = [];
    }
    weeklyData[weekStart].push(entry);
  });

  return Object.entries(weeklyData).map(([weekStart, entries]) => ({
    date: weekStart,
    yield_2yr: Number((entries.reduce((sum, e) => sum + e.yield_2yr, 0) / entries.length).toFixed(2)),
    yield_5yr: Number((entries.reduce((sum, e) => sum + e.yield_5yr, 0) / entries.length).toFixed(2)),
    yield_10yr: Number((entries.reduce((sum, e) => sum + e.yield_10yr, 0) / entries.length).toFixed(2)),
    yield_30yr: Number((entries.reduce((sum, e) => sum + e.yield_30yr, 0) / entries.length).toFixed(2)),
  }));
};

export const useBondData = (
  dateRange: DateRange,
  showWeeklyAverage: boolean,
) => {
  return useQuery({
    queryKey: ['bondYields', dateRange, showWeeklyAverage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bond_yields')
        .select('*')
        .gte('date', dateRange.start.toISOString().split('T')[0])
        .lte('date', dateRange.end.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      if (!data) return [];

      const bondData = data as BondData[];
      return showWeeklyAverage ? calculateWeeklyAverage(bondData) : bondData;
    },
  });
};

export const exportToCSV = (data: BondData[]) => {
  const headers = ['Date', '2 Year Yield', '5 Year Yield', '10 Year Yield', '30 Year Yield'];
  const csvData = data.map(row => 
    [row.date, row.yield_2yr, row.yield_5yr, row.yield_10yr, row.yield_30yr].join(',')
  );
  
  const csv = [headers.join(','), ...csvData].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bond-yields-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
