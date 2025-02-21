
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, RefreshCw } from "lucide-react";
import { BondYieldsChart } from "@/components/demos/bond-yields/BondYieldsChart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BondYieldsDemo = () => {
  const { data: bondData } = useQuery({
    queryKey: ['bondYields'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bond_yields')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  const { data: lastUpdate } = useQuery({
    queryKey: ['bondYieldsLastUpdate'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bond_yields')
        .select('last_update')
        .order('last_update', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0]?.last_update;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Canadian Bond Yields</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and analyze historical yields of Canadian government bonds
          </p>
          {lastUpdate && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4" />
              Last updated: {format(new Date(lastUpdate), 'PPp')}
            </div>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <BondYieldsChart />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Bond Yields</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">2 Year</TableHead>
                  <TableHead className="text-right">5 Year</TableHead>
                  <TableHead className="text-right">10 Year</TableHead>
                  <TableHead className="text-right">30 Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bondData?.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{format(new Date(row.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">{row.yield_2yr?.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{row.yield_5yr?.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{row.yield_10yr?.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{row.yield_30yr?.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BondYieldsDemo;
