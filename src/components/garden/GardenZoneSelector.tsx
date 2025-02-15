
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hardinessZones } from "@/data/hardinessZones";

interface GardenZoneSelectorProps {
  selectedZone: string;
  onZoneChange: (value: string) => void;
}

export const GardenZoneSelector = ({ selectedZone, onZoneChange }: GardenZoneSelectorProps) => {
  return (
    <div>
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
  );
};
