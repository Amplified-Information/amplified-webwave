
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchSectionProps {
  searchQuery: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  showUSA: boolean;
  showCanada: boolean;
  onShowUSAChange: (checked: boolean) => void;
  onShowCanadaChange: (checked: boolean) => void;
}

export const SearchSection = ({
  searchQuery,
  loading,
  onSearchChange,
  onSearch,
  showUSA,
  showCanada,
  onShowUSAChange,
  onShowCanadaChange,
}: SearchSectionProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Search by Company Name or Symbol
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter company name or symbol..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />
        <Button onClick={onSearch} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          Search
        </Button>
      </div>
      <div className="flex gap-6 mt-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="usa" 
            checked={showUSA}
            onCheckedChange={onShowUSAChange}
          />
          <label
            htmlFor="usa"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            USA (NYSE/NASDAQ)
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="canada" 
            checked={showCanada}
            onCheckedChange={onShowCanadaChange}
          />
          <label
            htmlFor="canada"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Canada (TSX)
          </label>
        </div>
      </div>
    </div>
  );
};
