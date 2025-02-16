
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hardinessZones } from "@/data/hardinessZones";
import { countries } from "@/data/countries";

interface GardenZoneSelectorProps {
  selectedZone: string;
  onZoneChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
}

export const GardenZoneSelector = ({ 
  selectedZone, 
  onZoneChange,
  selectedCountry,
  onCountryChange
}: GardenZoneSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Country
          </label>
          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="zone-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Hardiness Zone
          </label>
          <Select value={selectedZone} onValueChange={onZoneChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your zone" />
            </SelectTrigger>
            <SelectContent>
              {hardinessZones.map((zone) => (
                <SelectItem key={zone.value} value={zone.value}>
                  {zone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
