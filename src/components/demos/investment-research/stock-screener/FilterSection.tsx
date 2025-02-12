
import { Input } from "@/components/ui/input";

interface FilterSectionProps {
  marketCap: string;
  peRatio: string;
  onMarketCapChange: (value: string) => void;
  onPeRatioChange: (value: string) => void;
}

export const FilterSection = ({
  marketCap,
  peRatio,
  onMarketCapChange,
  onPeRatioChange,
}: FilterSectionProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Market Cap (Minimum, in billions)
        </label>
        <Input
          type="number"
          placeholder="e.g., 10"
          value={marketCap}
          onChange={(e) => onMarketCapChange(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          P/E Ratio (Maximum)
        </label>
        <Input
          type="number"
          placeholder="e.g., 20"
          value={peRatio}
          onChange={(e) => onPeRatioChange(e.target.value)}
        />
      </div>
    </div>
  );
};
