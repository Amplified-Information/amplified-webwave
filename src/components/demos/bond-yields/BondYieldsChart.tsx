
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
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useBondData, exportToCSV } from "./useBondData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BondSeries, BondYieldsFilters } from "./types";

export const BondYieldsChart = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
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

  const { data, isLoading, error, refetch } = useBondData(
    filters.dateRange,
    filters.showWeeklyAverage,
  );

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.functions.invoke('update-bond-data');
      if (error) throw error;
      
      await refetch();
      toast({
        title: "Success",
        description: "Bond yield data has been updated.",
      });
    } catch (err) {
      console.error('Error updating bond data:', err);
      toast({
        title: "Error",
        description: "Failed to update bond yield data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleBond = (bondId: string) => {
    setVisibleBonds(prev =>
      prev.map(bond =>
        bond.id === bondId ? { ...bond, visible: !bond.visible } : bond
      )
    );
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error loading bond data</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No bond yield data available</p>
        <Button onClick={handleUpdate} disabled={isUpdating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? 'Updating...' : 'Load Data'}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(data)}
        >
          Export CSV
        </Button>
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
