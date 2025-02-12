
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CriteriaCard } from "./CriteriaCard";
import { SearchForm } from "./SearchForm";
import { StockAnalysisResult } from "./StockAnalysisResult";
import { calculateRSI, calculateShortSqueezePotential } from "./utils";
import type { StockData } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ShortSqueezeCandidate {
  symbol: string;
  company_name: string | null;
  short_interest_ratio: number | null;
  relative_volume: number | null;
  price_momentum: number | null;
  rsi: number | null;
  days_to_cover: number | null;
  distance_from_high: number | null;
  volume_surge: number | null;
}

export const ShortSqueezeAnalyzer = () => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [candidates, setCandidates] = useState<ShortSqueezeCandidate[]>([]);
  const [analyzingCandidates, setAnalyzingCandidates] = useState(false);
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

  const findShortSqueezeCandidates = async () => {
    setAnalyzingCandidates(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-short-squeeze');
      
      if (error) {
        throw error;
      }

      if (data.candidates) {
        setCandidates(data.candidates);
        toast({
          title: "Analysis Complete",
          description: `Found ${data.candidates.length} potential short squeeze candidates`,
        });
      }
    } catch (error) {
      console.error('Error analyzing short squeeze candidates:', error);
      toast({
        title: "Error",
        description: "Failed to analyze short squeeze candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingCandidates(false);
    }
  };

  const formatNumber = (value: number | null, decimals: number = 2): string => {
    if (value === null) return 'N/A';
    return value.toFixed(decimals);
  };

  return (
    <div className="space-y-6">
      <CriteriaCard />
      <div className="flex justify-between items-center">
        <SearchForm 
          symbol={symbol}
          onSymbolChange={setSymbol}
          onAnalyze={analyzeStock}
          loading={loading}
        />
        <Button
          onClick={findShortSqueezeCandidates}
          disabled={analyzingCandidates}
          className="ml-4"
        >
          {analyzingCandidates ? (
            <>
              <PlayCircle className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Find Short Squeeze Candidates
            </>
          )}
        </Button>
      </div>
      
      {stockData && (
        <StockAnalysisResult 
          stockData={stockData}
          calculateShortSqueezePotential={calculateShortSqueezePotential}
        />
      )}

      {candidates.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Short Squeeze Candidates</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Short Interest %</TableHead>
                    <TableHead>Days to Cover</TableHead>
                    <TableHead>RSI</TableHead>
                    <TableHead>Volume Surge</TableHead>
                    <TableHead>Price Momentum</TableHead>
                    <TableHead>Distance from High</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.symbol}>
                      <TableCell className="font-medium">{candidate.symbol}</TableCell>
                      <TableCell>{candidate.company_name || 'N/A'}</TableCell>
                      <TableCell>{formatNumber(candidate.short_interest_ratio)}%</TableCell>
                      <TableCell>{formatNumber(candidate.days_to_cover)}</TableCell>
                      <TableCell>{formatNumber(candidate.rsi)}</TableCell>
                      <TableCell>{candidate.volume_surge ? `${formatNumber(candidate.volume_surge)}x` : 'N/A'}</TableCell>
                      <TableCell className={candidate.price_momentum && candidate.price_momentum > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatNumber(candidate.price_momentum)}%
                      </TableCell>
                      <TableCell>{formatNumber(candidate.distance_from_high)}%</TableCell>
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
