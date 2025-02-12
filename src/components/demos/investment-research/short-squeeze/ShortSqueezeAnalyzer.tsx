
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Info } from "lucide-react";

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
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Phil Erlanger's Short Squeeze Identification Criteria
              </h4>
              <div className="grid gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-700">1. High Short Interest Ratio (SIR)</p>
                  <p>Days-to-cover ratio of 5+ indicates potential for trapped short sellers</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">2. Rising Stock Price Strength</p>
                  <p>Look for upward price momentum and rising moving averages</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">3. Sentiment Indicators</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Erlanger Short Rank: Measures short position crowding</li>
                    <li>Short Intensity: Indicates short seller aggressiveness</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700">4. Technical Breakouts</p>
                  <p>Watch for breaks above key resistance levels (e.g., 52-week highs)</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">5. Volume Confirmation</p>
                  <p>Significant volume increase suggests strong buying pressure</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
