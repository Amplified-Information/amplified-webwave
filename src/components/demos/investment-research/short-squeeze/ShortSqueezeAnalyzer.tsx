
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CriteriaCard } from "./CriteriaCard";
import { SearchForm } from "./SearchForm";
import { StockAnalysisResult } from "./StockAnalysisResult";
import { calculateRSI, calculateShortSqueezePotential } from "./utils";
import type { StockData } from "./types";

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
      const { data: secrets, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'ALPHA_VANTAGE_API_KEY')
        .single();

      if (secretError) throw secretError;
      if (!secrets) throw new Error('API key not found');

      const apiKey = secrets.value;

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
        
        const prices = timeSeriesDates.slice(0, 14).map(date => parseFloat(timeSeries[date]["4. close"]));
        const rsi = calculateRSI(prices);
        
        const current_volume = parseInt(quote["06. volume"]);
        const avg_volume = parseInt(overviewData.AverageVolume) || 0;
        const relative_volume = avg_volume > 0 ? current_volume / avg_volume : null;

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

  return (
    <div className="space-y-6">
      <CriteriaCard />
      <SearchForm 
        symbol={symbol}
        onSymbolChange={setSymbol}
        onAnalyze={analyzeStock}
        loading={loading}
      />
      {stockData && (
        <StockAnalysisResult 
          stockData={stockData}
          calculateShortSqueezePotential={calculateShortSqueezePotential}
        />
      )}
    </div>
  );
};
