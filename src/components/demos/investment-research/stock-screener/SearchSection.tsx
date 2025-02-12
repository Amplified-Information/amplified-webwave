
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchSection = ({
  searchQuery,
  loading,
  onSearchChange,
  onSearch,
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
    </div>
  );
};
