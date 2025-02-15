
import { Input } from "@/components/ui/input";

interface GardenSizeInputProps {
  gardenSize: string;
  onSizeChange: (value: string) => void;
}

export const GardenSizeInput = ({ gardenSize, onSizeChange }: GardenSizeInputProps) => {
  return (
    <div>
      <label htmlFor="garden-size" className="block text-sm font-medium text-gray-700 mb-2">
        Garden Size (sq ft)
      </label>
      <Input
        id="garden-size"
        type="number"
        placeholder="Enter garden size"
        value={gardenSize}
        onChange={(e) => onSizeChange(e.target.value)}
        className="w-full"
        step="100"
        min="0"
      />
    </div>
  );
};
