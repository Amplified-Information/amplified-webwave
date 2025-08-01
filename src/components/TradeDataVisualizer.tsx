import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useToast } from "@/components/ui/use-toast";

interface TradeData {
  commodity_desc: string;
  trade_balance: number;
}

const fetchTradeData = async () => {
  const { data, error } = await supabase
    .from('trade_data')
    .select('commodity_desc, trade_value, trade_flow_desc, reporter_desc')
    .in('reporter_desc', ['Canada', 'United States'])
    .in('partner_desc', ['Canada', 'United States']);

  if (error) throw error;

  // Process data to calculate trade balance by commodity
  const balanceByProduct = data.reduce((acc: { [key: string]: number }, curr) => {
    const value = curr.trade_value;
    const isCanadaExport = curr.reporter_desc === 'Canada' && curr.trade_flow_desc === 'Export';
    const isUSAImport = curr.reporter_desc === 'United States' && curr.trade_flow_desc === 'Import';
    
    // Positive values represent Canadian surplus
    const tradeValue = (isCanadaExport || isUSAImport) ? value : -value;
    
    acc[curr.commodity_desc] = (acc[curr.commodity_desc] || 0) + tradeValue;
    return acc;
  }, {});

  // Convert to array format for chart
  return Object.entries(balanceByProduct).map(([commodity_desc, trade_balance]) => ({
    commodity_desc,
    trade_balance
  }));
};

export const TradeDataVisualizer = () => {
  const { toast } = useToast();
  const { data: tradeData, isLoading, error, refetch } = useQuery({
    queryKey: ['canada-usa-trade'],
    queryFn: fetchTradeData,
  });

  const loadTradeData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-trade-data');
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Loaded ${data.count} trade records successfully`,
      });
      
      // Refetch the data to update the chart
      refetch();
    } catch (error) {
      console.error('Error loading trade data:', error);
      toast({
        title: "Error",
        description: "Failed to load trade data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-600">Loading trade data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-red-600">Error loading trade data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button onClick={loadTradeData}>
          Refresh Trade Data
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Canada-USA Trade Balance by Sector</CardTitle>
          <CardDescription>
            Trade surplus/deficit analysis between Canada and USA by commodity sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <ChartContainer
              className="h-full"
              config={{
                primary: {
                  theme: {
                    light: "var(--primary)",
                    dark: "var(--primary)",
                  },
                },
              }}
            >
              <RechartsBarChart
                data={tradeData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
              >
                <XAxis type="number" 
                  label={{ value: 'Trade Balance (USD)', position: 'bottom' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="commodity_desc" 
                  width={140}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const value = payload[0].value as number;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Sector:</div>
                          <div>{payload[0].payload.commodity_desc}</div>
                          <div className="font-medium">Balance:</div>
                          <div className={value >= 0 ? "text-green-600" : "text-red-600"}>
                            ${Math.abs(value).toLocaleString()}
                            {value >= 0 ? " surplus" : " deficit"}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="trade_balance" fill="var(--primary)">
                  {tradeData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.trade_balance >= 0 ? "var(--primary)" : "#ef4444"} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};