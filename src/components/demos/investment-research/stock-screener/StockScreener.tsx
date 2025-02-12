
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";

interface ScreenerData {
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

export const StockScreener = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScreenerData[]>([]);
  const [marketCap, setMarketCap] = useState("");
  const [peRatio, setPeRatio] = useState("");
  const { toast } = useToast();

  const screenStocks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stock_screener")
        .select("*")
        .gte("market_cap", marketCap ? parseFloat(marketCap) * 1e9 : 0) // Convert to billions
        .lte("pe_ratio", peRatio ? parseFloat(peRatio) : 100)
        .order("market_cap", { ascending: false })
        .limit(20);

      if (error) throw error;

      setResults(data);
      toast({
        title: "Screening Complete",
        description: `Found ${data.length} stocks matching your criteria`,
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
      toast({
        title: "Error",
        description: "Failed to screen stocks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | null, decimals = 2) => {
    if (num === null) return "N/A";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatMarketCap = (marketCap: number | null) => {
    if (marketCap === null) return "N/A";
    const billion = 1e9;
    return `$${(marketCap / billion).toFixed(2)}B`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Stock Screener</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Cap (Minimum, in billions)
              </label>
              <Input
                type="number"
                placeholder="e.g., 10"
                value={marketCap}
                onChange={(e) => setMarketCap(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                P/E Ratio (Maximum)
              </label>
              <Input
                type="number"
                placeholder="e.g., 20"
                value={peRatio}
                onChange={(e) => setPeRatio(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={screenStocks} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Screen Stocks
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>P/E Ratio</TableHead>
                    <TableHead>Price/Book</TableHead>
                    <TableHead>Dividend Yield</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>{stock.company_name || "N/A"}</TableCell>
                      <TableCell>{formatMarketCap(stock.market_cap)}</TableCell>
                      <TableCell>{formatNumber(stock.pe_ratio)}</TableCell>
                      <TableCell>{formatNumber(stock.price_to_book)}</TableCell>
                      <TableCell>
                        {stock.dividend_yield ? `${formatNumber(stock.dividend_yield)}%` : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
