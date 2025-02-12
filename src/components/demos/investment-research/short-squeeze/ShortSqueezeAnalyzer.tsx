
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2 } from "lucide-react";

interface StockData {
  symbol: string;
  company_name: string | null;
  short_interest_ratio: number | null;
  short_interest_volume: number | null;
  average_volume: number | null;
  current_price: number | null;
  previous_close: number | null;
  days_to_cover: number | null;
}

export const ShortSqueezeAnalyzer = () => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const { toast } = useToast();

  const analyzeStock = async () => {
    if (!symbol) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stock_data")
        .select("*")
        .eq("symbol", symbol.toUpperCase())
        .single();

      if (error) throw error;

      setStockData(data);
      toast({
        title: "Analysis Complete",
        description: `Retrieved data for ${symbol.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
      toast({
        title: "Error",
        description: "Failed to analyze stock. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Enter stock symbol (e.g., GME)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={analyzeStock} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          Analyze
        </Button>
      </div>

      {stockData && (
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{stockData.company_name || stockData.symbol}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Short Interest Ratio</p>
                    <p className="font-medium">{stockData.short_interest_ratio?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Days to Cover</p>
                    <p className="font-medium">{stockData.days_to_cover?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="font-medium">${stockData.current_price?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Previous Close</p>
                    <p className="font-medium">${stockData.previous_close?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Short Volume</p>
                    <p className="font-medium">
                      {stockData.short_interest_volume?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Volume</p>
                    <p className="font-medium">
                      {stockData.average_volume?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
