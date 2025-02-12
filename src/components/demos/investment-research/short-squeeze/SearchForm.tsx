
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface SearchFormProps {
  symbol: string;
  onSymbolChange: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export const SearchForm = ({ symbol, onSymbolChange, onAnalyze, loading }: SearchFormProps) => {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Enter stock symbol (e.g., GME)"
        value={symbol}
        onChange={(e) => onSymbolChange(e.target.value)}
        className="max-w-xs"
      />
      <Button onClick={onAnalyze} disabled={loading}>
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Search className="w-4 h-4 mr-2" />
        )}
        Analyze
      </Button>
    </div>
  );
};
