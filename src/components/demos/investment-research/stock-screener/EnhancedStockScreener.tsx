
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchSection } from "./SearchSection";
import { FilterSection } from "./FilterSection";
import { ResultsTable } from "./ResultsTable";
import type { ScreenerData, MetadataOption } from "./types";

export const EnhancedStockScreener = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScreenerData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectors, setSectors] = useState<MetadataOption[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [marketCap, setMarketCap] = useState("");
  const [peRatio, setPeRatio] = useState("");
  const [showUSA, setShowUSA] = useState(true);
  const [showCanada, setShowCanada] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const { data: sectorData, error: sectorError } = await supabase
          .from('stock_metadata')
          .select('value')
          .eq('type', 'sector')
          .order('value');

        if (sectorError) throw sectorError;
        setSectors(sectorData?.map(item => ({ value: item.value, label: item.value })) ?? []);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        toast({
          title: "Error",
          description: "Failed to load filter options. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchMetadata();
  }, [toast]);

  const searchStocks = async () => {
    if (!searchQuery && selectedSectors.length === 0 && !showUSA && !showCanada) {
      toast({
        title: "Error",
        description: "Please enter a search term or select filters",
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
      
      const directSymbol = searchQuery.toUpperCase();
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(
          directSymbol
        )}&apikey=${apiKey}`
      );
      let overviewData = await overviewResponse.json(); // Changed from const to let
      
      if (overviewData.Note) {
        toast({
          title: "API Rate Limit Reached",
          description: "Alpha Vantage free tier is limited to 5 calls per minute. Please wait a minute and try again.",
          variant: "destructive",
        });
        return;
      }

      if (Object.keys(overviewData).length <= 1) {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
            searchQuery
          )}&apikey=${apiKey}`
        );
        
        const data = await response.json();
        
        if (data.Note) {
          toast({
            title: "API Rate Limit Reached",
            description: "Alpha Vantage free tier is limited to 5 calls per minute. Please wait a minute and try again.",
            variant: "destructive",
          });
          return;
        }

        if (!data.bestMatches || data.bestMatches.length === 0) {
          setResults([]);
          toast({
            title: "No Results",
            description: "No matches found. Try searching with the exact stock symbol (e.g., AAPL for Apple Inc.)",
          });
          return;
        }

        const firstMatch = data.bestMatches[0];
        const matchOverviewResponse = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(
            firstMatch["1. symbol"]
          )}&apikey=${apiKey}`
        );
        const matchOverviewData = await matchOverviewResponse.json();

        if (matchOverviewData.Note) {
          toast({
            title: "API Rate Limit Reached",
            description: "Alpha Vantage free tier is limited to 5 calls per minute. Please wait a minute and try again.",
            variant: "destructive",
          });
          return;
        }

        overviewData = matchOverviewData;
      }

      if (Object.keys(overviewData).length > 1) {
        const stockResult: ScreenerData = {
          symbol: overviewData.Symbol,
          company_name: overviewData.Name || searchQuery,
          country: overviewData.Country || "N/A",
          sector: overviewData.Sector || null,
          market_cap: overviewData.MarketCapitalization ? parseFloat(overviewData.MarketCapitalization) : null,
          pe_ratio: overviewData.PERatio ? parseFloat(overviewData.PERatio) : null,
          price_to_book: overviewData.PriceToBookRatio ? parseFloat(overviewData.PriceToBookRatio) : null,
          dividend_yield: overviewData.DividendYield ? parseFloat(overviewData.DividendYield) : null,
          fifty_day_ma: overviewData["50DayMovingAverage"] ? parseFloat(overviewData["50DayMovingAverage"]) : null,
          two_hundred_day_ma: overviewData["200DayMovingAverage"] ? parseFloat(overviewData["200DayMovingAverage"]) : null,
          year_high: overviewData["52WeekHigh"] ? parseFloat(overviewData["52WeekHigh"]) : null,
          year_low: overviewData["52WeekLow"] ? parseFloat(overviewData["52WeekLow"]) : null,
          volume: overviewData.Volume ? parseFloat(overviewData.Volume) : null,
          avg_volume: null,
        };

        const matchesFilters = (
          (selectedSectors.length === 0 || (stockResult.sector && selectedSectors.includes(stockResult.sector))) &&
          (!marketCap || (stockResult.market_cap && stockResult.market_cap >= parseFloat(marketCap) * 1e9)) &&
          (!peRatio || (stockResult.pe_ratio && stockResult.pe_ratio <= parseFloat(peRatio))) &&
          ((!showUSA && !showCanada) ||
            (showUSA && stockResult.country === "United States") ||
            (showCanada && stockResult.country === "Canada"))
        );

        if (matchesFilters) {
          setResults([stockResult]);
          toast({
            title: "Search Complete",
            description: "Found company data",
          });
        } else {
          setResults([]);
          toast({
            title: "No Results",
            description: "Company found but doesn't match selected filters",
          });
        }
      } else {
        setResults([]);
        toast({
          title: "No Results",
          description: "Company not found. Try searching with the stock symbol (e.g., AAPL for Apple Inc.)",
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

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-3">Sectors</Label>
          <div className="border rounded-md p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[300px] overflow-y-auto">
              {(sectors ?? []).map((sector) => (
                <div key={sector.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sector-${sector.value}`}
                    checked={selectedSectors.includes(sector.value)}
                    onCheckedChange={(checked) => {
                      setSelectedSectors(prev =>
                        checked
                          ? [...prev, sector.value]
                          : prev.filter(s => s !== sector.value)
                      );
                    }}
                  />
                  <label
                    htmlFor={`sector-${sector.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {sector.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FilterSection
          marketCap={marketCap}
          peRatio={peRatio}
          onMarketCapChange={setMarketCap}
          onPeRatioChange={setPeRatio}
        />
      </div>

      {results.length > 0 && (
        <ResultsTable
          results={results}
          formatMarketCap={formatMarketCap}
          formatNumber={formatNumber}
        />
      )}
    </div>
  );
};
