
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Info, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  short_percent_float?: number | null;
  relative_volume?: number | null;
  price_change_percent?: number | null;
  rsi?: number | null;
}

export const ShortSqueezeAnalyzer = () => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const { toast } = useToast();

  const calculateRSI = (prices: number[]): number => {
    if (prices.length < 14) return 0;
    
    const changes = prices.slice(1).map((price, index) => price - prices[index]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = gains.slice(0, 14).reduce((a, b) => a + b) / 14;
    const avgLoss = losses.slice(0, 14).reduce((a, b) => a + b) / 14;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

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

      // Fetch multiple data points in parallel
      const [overviewResponse, quoteResponse, timeSeriesResponse] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`),
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`),
        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`)
      ]);

      const [overviewData, quoteData, timeSeriesData] = await Promise.all([
        overviewResponse.json(),
        quoteResponse.json(),
        timeSeriesResponse.json()
      ]);

      if (overviewData && quoteData["Global Quote"] && timeSeriesData["Time Series (Daily)"]) {
        const quote = quoteData["Global Quote"];
        const timeSeries = timeSeriesData["Time Series (Daily)"];
        const timeSeriesDates = Object.keys(timeSeries).sort().reverse();
        
        // Calculate price changes and RSI
        const prices = timeSeriesDates.slice(0, 14).map(date => parseFloat(timeSeries[date]["4. close"]));
        const rsi = calculateRSI(prices);
        
        // Calculate relative volume
        const current_volume = parseInt(quote["06. volume"]);
        const avg_volume = parseInt(overviewData.AverageVolume) || 0;
        const relative_volume = avg_volume > 0 ? current_volume / avg_volume : null;

        // Calculate price change percentage
        const current_price = parseFloat(quote["05. price"]);
        const previous_close = parseFloat(quote["08. previous close"]);
        const price_change_percent = ((current_price - previous_close) / previous_close) * 100;

        const stockInfo: StockData = {
          symbol: symbol.toUpperCase(),
          company_name: overviewData.Name || null,
          current_price: current_price || null,
          previous_close: previous_close || null,
          volume: current_volume || null,
          avg_volume: avg_volume || null,
          fifty_day_ma: parseFloat(overviewData["50DayMovingAverage"]) || null,
          two_hundred_day_ma: parseFloat(overviewData["200DayMovingAverage"]) || null,
          year_high: parseFloat(overviewData["52WeekHigh"]) || null,
          short_percent_float: parseFloat(overviewData.ShortPercentFloat) || null,
          relative_volume,
          price_change_percent,
          rsi
        };

        setStockData(stockInfo);
        
        // Analyze squeeze potential
        const hasHighShortInterest = stockInfo.short_percent_float && stockInfo.short_percent_float > 20;
        const hasHighRelativeVolume = stockInfo.relative_volume && stockInfo.relative_volume > 1.5;
        const hasPriceStrength = stockInfo.rsi && stockInfo.rsi > 70;
        const isNearYearHigh = stockInfo.current_price && stockInfo.year_high && 
                              (stockInfo.current_price >= stockInfo.year_high * 0.9);

        if (hasHighShortInterest && hasHighRelativeVolume && (hasPriceStrength || isNearYearHigh)) {
          toast({
            title: "High Squeeze Potential Detected",
            description: "This stock shows multiple indicators of short squeeze potential.",
            variant: "default",
          });
        } else {
          toast({
            title: "Analysis Complete",
            description: `Retrieved data for ${symbol.toUpperCase()}`,
          });
        }
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

  const calculateShortSqueezePotential = (data: StockData): string => {
    if (!data.short_percent_float || !data.relative_volume || !data.rsi) {
      return "Insufficient data";
    }

    let score = 0;
    
    // Short Interest Score (max 3 points)
    if (data.short_percent_float > 30) score += 3;
    else if (data.short_percent_float > 20) score += 2;
    else if (data.short_percent_float > 10) score += 1;

    // Volume Analysis (max 3 points)
    if (data.relative_volume > 2) score += 3;
    else if (data.relative_volume > 1.5) score += 2;
    else if (data.relative_volume > 1.2) score += 1;

    // Technical Strength (max 3 points)
    if (data.rsi > 70) score += 3;
    else if (data.rsi > 60) score += 2;
    else if (data.rsi > 50) score += 1;

    // Price Momentum (max 1 point)
    if (data.price_change_percent && data.price_change_percent > 5) score += 1;

    // Convert score to rating
    if (score >= 8) return "Very High";
    if (score >= 6) return "High";
    if (score >= 4) return "Medium";
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
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{stockData.company_name || stockData.symbol}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="font-medium">${stockData.current_price?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Short % of Float</p>
                    <p className="font-medium">{stockData.short_percent_float?.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relative Volume</p>
                    <p className="font-medium">{stockData.relative_volume?.toFixed(2)}x</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">RSI (14)</p>
                    <p className="font-medium">{stockData.rsi?.toFixed(2) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price Change</p>
                    <p className={`font-medium ${
                      stockData.price_change_percent && stockData.price_change_percent > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {stockData.price_change_percent?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Squeeze Potential</p>
                    <p className="font-medium">{calculateShortSqueezePotential(stockData)}</p>
                  </div>
                </div>
              </div>

              {stockData.short_percent_float === null && (
                <Alert variant="warning" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Short interest data is not available for this stock. This may affect the accuracy of the squeeze analysis.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
