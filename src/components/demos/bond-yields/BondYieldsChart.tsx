
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useBondData, exportToCSV } from "./useBondData";
import type { BondSeries, BondYieldsFilters } from "./types";

export const BondYieldsChart = () => {
  const [filters, setFilters] = useState<BondYieldsFilters>({
    dateRange: {
      start: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
      end: new Date(),
    },
    showWeeklyAverage: false,
    timeRangeOption: 'all',
  });

  const [visibleBonds, setVisibleBonds] = useState<BondSeries[]>([
    { id: "yield_2yr", name: "2 Year", color: "#22c55e", visible: true },
    { id: "yield_5yr", name: "5 Year", color: "#3b82f6", visible: true },
    { id: "yield_10yr", name: "10 Year", color: "#ec4899", visible: true },
    { id: "yield_30yr", name: "30 Year", color: "#8b5cf6", visible: true },
  ]);

  const { data, isLoading, error } = useBondData(
    filters.dateRange,
    filters.showWeeklyAverage,
  );

  const handleFiltersChange = (newFilters: Partial<BondYieldsFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Update date range based on time range option
      if (newFilters.timeRangeOption) {
        const end = new Date();
        let start = new Date();
        
        switch (newFilters.timeRangeOption) {
          case '1y':
            start.setFullYear(end.getFullYear() - 1);
            break;
          case '6m':
            start.setMonth(end.getMonth() - 6);
            break;
          case '3m':
            start.setMonth(end.getMonth() - 3);
            break;
          case '1m':
            start.setMonth(end.getMonth() - 1);
            break;
          case 'all':
            start = new Date(new Date().setFullYear(new Date().getFullYear() - 5));
            break;
        }
        
        updated.dateRange = { start, end };
      }
      
      return updated;
    });
  };

  const toggleBond = (bondId: string) => {
    setVisibleBonds(prev =>
      prev.map(bond =>
        bond.id === bondId ? { ...bond, visible: !bond.visible } : bond
      )
    );
  };

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading bond data</div>;
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {visibleBonds.map(bond => (
          <button
            key={bond.id}
            onClick={() => toggleBond(bond.id)}
            className={`px-3 py-1 rounded-full text-sm ${
              bond.visible ? 'bg-gray-200' : 'bg-gray-100 text-gray-400'
            }`}
            style={{ borderColor: bond.color }}
          >
            {bond.name}
          </button>
        ))}
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis
              tickFormatter={(value) => `${value.toFixed(2)}%`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: number) => [`${value.toFixed(2)}%`]}
            />
            <Legend />
            {visibleBonds.map(bond => (
              bond.visible && (
                <Line
                  key={bond.id}
                  type="monotone"
                  dataKey={bond.id}
                  stroke={bond.color}
                  dot={false}
                  name={bond.name}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
