
import { useState, useEffect } from "react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResultsTable } from "./ResultsTable";
import type { ScreenerData } from "./types";

interface MetadataOption {
  value: string;
  label: string;
}

export const EnhancedStockScreener = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScreenerData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectors, setSectors] = useState<MetadataOption[]>([]);
  const [countries, setCountries] = useState<MetadataOption[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [openSector, setOpenSector] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [marketCap, setMarketCap] = useState("");
  const [peRatio, setPeRatio] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch sectors
        const { data: sectorData, error: sectorError } = await supabase
          .from('stock_metadata')
          .select('value')
          .eq('type', 'sector')
          .order('value');

        if (sectorError) throw sectorError;
        setSectors(sectorData.map(item => ({ value: item.value, label: item.value })));

        // Fetch countries
        const { data: countryData, error: countryError } = await supabase
          .from('stock_metadata')
          .select('value')
          .eq('type', 'country')
          .order('value');

        if (countryError) throw countryError;
        setCountries(countryData.map(item => ({ value: item.value, label: item.value })));
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
    if (!searchQuery && !selectedSector && !selectedCountry) {
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
      
      // First search for symbols based on keywords
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
          searchQuery
        )}&apikey=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.bestMatches) {
        const stockResults: ScreenerData[] = await Promise.all(
          data.bestMatches.map(async (match: any) => {
            // Get additional company data using Overview endpoint
            const overviewResponse = await fetch(
              `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(
                match["1. symbol"]
              )}&apikey=${apiKey}`
            );
            const overviewData = await overviewResponse.json();

            return {
              symbol: match["1. symbol"],
              company_name: match["2. name"],
              country: overviewData.Country || match["4. region"],
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
          })
        );

        // Filter results based on selected criteria
        const filteredResults = stockResults.filter(stock => {
          const matchesSector = !selectedSector || stock.sector === selectedSector;
          const matchesCountry = !selectedCountry || stock.country === selectedCountry;
          const matchesMarketCap = !marketCap || (stock.market_cap && stock.market_cap >= parseFloat(marketCap) * 1e9);
          const matchesPE = !peRatio || (stock.pe_ratio && stock.pe_ratio <= parseFloat(peRatio));
          
          return matchesSector && matchesCountry && matchesMarketCap && matchesPE;
        });

        setResults(filteredResults);
        toast({
          title: "Search Complete",
          description: `Found ${filteredResults.length} stocks matching your criteria`,
        });
      } else {
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
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Search by Company Name or Symbol</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Enter company name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Market Cap (Minimum, in billions)</Label>
          <Input
            type="number"
            placeholder="e.g., 10"
            value={marketCap}
            onChange={(e) => setMarketCap(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label>Sector</Label>
          <Popover open={openSector} onOpenChange={setOpenSector}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSector}
                className="w-full justify-between mt-2"
              >
                {selectedSector || "Select sector..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandGroup>
                  {sectors.map((sector) => (
                    <CommandItem
                      key={sector.value}
                      onSelect={() => {
                        setSelectedSector(sector.value === selectedSector ? "" : sector.value);
                        setOpenSector(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSector === sector.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {sector.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Country</Label>
          <Popover open={openCountry} onOpenChange={setOpenCountry}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCountry}
                className="w-full justify-between mt-2"
              >
                {selectedCountry || "Select country..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.value}
                      onSelect={() => {
                        setSelectedCountry(country.value === selectedCountry ? "" : country.value);
                        setOpenCountry(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCountry === country.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>P/E Ratio (Maximum)</Label>
          <Input
            type="number"
            placeholder="e.g., 20"
            value={peRatio}
            onChange={(e) => setPeRatio(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <Button onClick={searchStocks} disabled={loading} className="w-full">
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Search className="w-4 h-4 mr-2" />
        )}
        Search Stocks
      </Button>

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
