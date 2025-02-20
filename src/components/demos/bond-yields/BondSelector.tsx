
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Download } from "lucide-react";
import type { BondYieldsFilters, DateRange } from "./types";

interface BondSelectorProps {
  filters: BondYieldsFilters;
  onFiltersChange: (filters: Partial<BondYieldsFilters>) => void;
  onExport: () => void;
}

export const BondSelector = ({ filters, onFiltersChange, onExport }: BondSelectorProps) => {
  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '1y', label: '1 Year' },
    { value: '6m', label: '6 Months' },
    { value: '3m', label: '3 Months' },
    { value: '1m', label: '1 Month' },
  ] as const;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <DatePickerWithRange
              date={{
                from: filters.dateRange.start,
                to: filters.dateRange.end,
              }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onFiltersChange({
                    dateRange: { start: range.from, end: range.to },
                    timeRangeOption: 'all',
                  });
                }
              }}
            />
          </div>
          
          <div className="flex gap-4">
            {timeRangeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onFiltersChange({ timeRangeOption: option.value })}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.timeRangeOption === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="weeklyAvg"
                checked={filters.showWeeklyAverage}
                onCheckedChange={(checked) => 
                  onFiltersChange({ showWeeklyAverage: checked === true })
                }
              />
              <Label htmlFor="weeklyAvg">Show weekly averages</Label>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
