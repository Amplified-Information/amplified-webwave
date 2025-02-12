
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
  current_price: number | null;
  previous_close: number | null;
  volume: number | null;
  avg_volume: number | null;
  fifty_day_ma: number | null;
  two_hundred_day_ma: number | null;
  year_high: number | null;
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
      // Get API key from Supabase secrets
      const { data: secrets, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'ALPHA_VANTAGE_API_KEY')
        .single();

      if (secretError) throw secretError;
      if (!secrets) throw new Error('API key not found');

      const apiKey = secrets.value;

      // Fetch company overview data
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
      );
      const overviewData = await overviewResponse.json();

      // Fetch global quote data for current price and volume
      const quoteResponse = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
      );
      const quoteData = await quoteResponse.json();

      if (overviewData && quoteData["Global Quote"]) {
        const quote = quoteData["Global Quote"];
        const stockInfo: StockData = {
          symbol: symbol.toUpperCase(),
          company_name: overviewData.Name || null,
          current_price: parseFloat(quote["05. price"]) || null,
          previous_close: parseFloat(quote["08. previous close"]) || null,
          volume: parseInt(quote["06. volume"]) || null,
          avg_volume: parseInt(overviewData.AverageVolume) || null,
          fifty_day_ma: parseFloat(overviewData["50DayMovingAverage"]) || null,
          two_hundred_day_ma: parseFloat(overviewData["200DayMovingAverage"]) || null,
          year_high: parseFloat(overviewData["52WeekHigh"]) || null,
        };

        setStockData(stockInfo);
        toast({
          title: "Analysis Complete",
          description: `Retrieved data for ${symbol.toUpperCase()}`,
        });
      } else {
        toast({
          title: "Error",
          description: "No data found for this symbol",
          variant: "destructive",
        });
      }
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

  const calculateBreakoutPotential = (data: StockData): string => {
    if (!data.current_price || !data.fifty_day_ma || !data.two_hundred_day_ma || !data.year_high) {
      return "Insufficient data";
    }

    const priceAbove50MA = data.current_price > data.fifty_day_ma;
    const priceAbove200MA = data.current_price > data.two_hundred_day_ma;
    const nearYearHigh = data.current_price >= data.year_high * 0.9; // Within 10% of year high

    if (priceAbove50MA && priceAbove200MA && nearYearHigh) {
      return "High";
    } else if ((priceAbove50MA && priceAbove200MA) || nearYearHigh) {
      return "Medium";
    } else {
      return "Low";
    }
  };

  const calculateVolumeStrength = (data: StockData): string => {
    if (!data.volume || !data.avg_volume) {
      return "Insufficient data";
    }

    const volumeRatio = data.volume / data.avg_volume;
    if (volumeRatio >= 2) return "High";
    if (volumeRatio >= 1.2) return "Medium";
    return "Low";
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
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="font-medium">${stockData.current_price?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Previous Close</p>
                    <p className="font-medium">${stockData.previous_close?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Volume</p>
                    <p className="font-medium">{stockData.volume?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Volume</p>
                    <p className="font-medium">{stockData.avg_volume?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">50-Day MA</p>
                    <p className="font-medium">${stockData.fifty_day_ma?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">200-Day MA</p>
                    <p className="font-medium">${stockData.two_hundred_day_ma?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Breakout Potential</p>
                    <p className="font-medium">{calculateBreakoutPotential(stockData)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Volume Strength</p>
                    <p className="font-medium">{calculateVolumeStrength(stockData)}</p>
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
