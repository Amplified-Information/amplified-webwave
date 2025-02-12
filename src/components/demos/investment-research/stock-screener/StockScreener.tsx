
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { SearchSection } from "./SearchSection";
import { FilterSection } from "./FilterSection";
import { ResultsTable } from "./ResultsTable";
import type { ScreenerData } from "./types";

export const StockScreener = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScreenerData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const [peRatio, setPeRatio] = useState("");
  const [showUSA, setShowUSA] = useState(true);
  const [showCanada, setShowCanada] = useState(true);
  const { toast } = useToast();

  const filterByExchange = (matches: any[]) => {
    return matches.filter((match) => {
      const symbol = match["1. symbol"];
      const region = match["4. region"];
      
      if (!showUSA && !showCanada) return true; // Show all if none selected
      
      const isUSA = region === "United States" || (!symbol.includes(".") && region.includes("United States"));
      const isCanada = region === "Toronto" || symbol.endsWith(".TRT") || region.includes("Canada");
      
      return (showUSA && isUSA) || (showCanada && isCanada);
    });
  };

  const searchStocks = async () => {
    if (!searchQuery) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: secrets, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'ALPHA_VANTAGE_API_KEY');

      if (secretError) throw secretError;
      if (!secrets || secrets.length === 0) {
        throw new Error('API key not found');
      }

      const apiKey = secrets[0].value;
      console.log("Fetching data from Alpha Vantage...");

      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
          searchQuery
        )}&apikey=${apiKey}`
      );
      
      const data = await response.json();
      console.log("Alpha Vantage response:", data);
      
      if (data.bestMatches) {
        const filteredMatches = filterByExchange(data.bestMatches);
        const stockResults: ScreenerData[] = filteredMatches.map((match: any) => {
          let country = "N/A";
          const region = match["4. region"];
          const symbol = match["1. symbol"];
          
          if (region === "United States" || (!symbol.includes(".") && region.includes("United States"))) {
            country = "USA";
          } else if (region === "Toronto" || symbol.endsWith(".TRT") || region.includes("Canada")) {
            country = "Canada";
          } else {
            country = region;
          }

          return {
            symbol: match["1. symbol"],
            company_name: match["2. name"],
            country: country,
            sector: null,
            market_cap: null,
            pe_ratio: null,
            price_to_book: null,
            dividend_yield: null,
            fifty_day_ma: null,
            two_hundred_day_ma: null,
            year_high: null,
            year_low: null,
            volume: null,
            avg_volume: null,
          };
        });

        setResults(stockResults);
        toast({
          title: "Search Complete",
          description: `Found ${stockResults.length} stocks matching your search`,
        });
      } else {
        console.log("No matches found in Alpha Vantage response");
        setResults([]);
        toast({
          title: "No Results",
          description: "No stocks found matching your search criteria",
        });
      }
    } catch (error) {
      console.error("Error searching stocks:", error);
      toast({
        title: "Error",
        description: "Failed to search stocks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const screenStocks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stock_screener")
        .select("*")
        .gte("market_cap", marketCap ? parseFloat(marketCap) * 1e9 : 0)
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

          <SearchSection
            searchQuery={searchQuery}
            loading={loading}
            onSearchChange={setSearchQuery}
            onSearch={searchStocks}
            showUSA={showUSA}
            showCanada={showCanada}
            onShowUSAChange={setShowUSA}
            onShowCanadaChange={setShowCanada}
          />

          <FilterSection
            marketCap={marketCap}
            peRatio={peRatio}
            onMarketCapChange={setMarketCap}
            onPeRatioChange={setPeRatio}
          />

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
            <ResultsTable
              results={results}
              formatMarketCap={formatMarketCap}
              formatNumber={formatNumber}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
