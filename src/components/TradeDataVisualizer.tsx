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
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface TradeData {
  reporter_country: string;
  partner_country: string;
  commodity_name: string;
  trade_value: number;
  trade_year: number;
  trade_flow: string;
}

const fetchTradeData = async () => {
  const { data, error } = await supabase
    .from('trade_data')
    .select('*')
    .order('trade_year', { ascending: true })
    .limit(100);

  if (error) throw error;
  return data as TradeData[];
};

export const TradeDataVisualizer = () => {
  const { data: tradeData, isLoading, error } = useQuery({
    queryKey: ['trade-data'],
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
          <CardTitle>Trade Flow Analysis</CardTitle>
          <CardDescription>
            Visualization of international trade patterns and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
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
              <RechartsBarChart data={tradeData}>
                <XAxis dataKey="trade_year" />
                <YAxis />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Year:</div>
                        <div>{payload[0].payload.trade_year}</div>
                        <div className="font-medium">Value:</div>
                        <div>${payload[0].value?.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                }} />
                <Bar
                  dataKey="trade_value"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};