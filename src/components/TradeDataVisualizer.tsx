import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface TradeData {
  commodity_name: string;
  trade_balance: number;
}

const fetchTradeData = async () => {
  const { data, error } = await supabase
    .from('trade_data')
    .select('commodity_name, trade_value, trade_flow, reporter_country')
    .in('reporter_country', ['Canada', 'United States'])
    .in('partner_country', ['Canada', 'United States']);

  if (error) throw error;

  // Process data to calculate trade balance by commodity
  const balanceByProduct = data.reduce((acc: { [key: string]: number }, curr) => {
    const value = curr.trade_value;
    const isCanadaExport = curr.reporter_country === 'Canada' && curr.trade_flow === 'Export';
    const isUSAImport = curr.reporter_country === 'United States' && curr.trade_flow === 'Import';
    
    // Positive values represent Canadian surplus
    const tradeValue = (isCanadaExport || isUSAImport) ? value : -value;
    
    acc[curr.commodity_name] = (acc[curr.commodity_name] || 0) + tradeValue;
    return acc;
  }, {});

  // Convert to array format for chart
  return Object.entries(balanceByProduct).map(([commodity_name, trade_balance]) => ({
    commodity_name,
    trade_balance
  }));
};

export const TradeDataVisualizer = () => {
  const { data: tradeData, isLoading, error } = useQuery({
    queryKey: ['canada-usa-trade'],
    queryFn: fetchTradeData,
  });

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
                  dataKey="commodity_name" 
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
                          <div>{payload[0].payload.commodity_name}</div>
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
                <Bar
                  dataKey="trade_balance"
                  fill={(data) => data.trade_balance >= 0 ? "var(--primary)" : "#ef4444"}
                />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};