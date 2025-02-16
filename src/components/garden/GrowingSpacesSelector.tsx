
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GrowingSpaces {
  heated_seed_starting: boolean;
  heated_greenhouse: boolean;
  unheated_polytunnel: boolean;
  hydroponics: boolean;
  outdoor_garden_irrigated: boolean;
  outdoor_garden_no_irrigation: boolean;
}

interface GrowingSpacesSizes {
  heated_seed_starting?: number;
  heated_greenhouse?: number;
  unheated_polytunnel?: number;
  hydroponics?: number;
  outdoor_garden_irrigated?: number;
  outdoor_garden_no_irrigation?: number;
}

interface GrowingSpacesSelectorProps {
  growingSpaces: GrowingSpaces;
  spaceSizes: GrowingSpacesSizes;
  onGrowingSpacesChange: (spaces: GrowingSpaces) => void;
  onSpaceSizesChange: (sizes: GrowingSpacesSizes) => void;
}

export const GrowingSpacesSelector = ({
  spaceSizes,
  onSpaceSizesChange,
}: GrowingSpacesSelectorProps) => {
  const handleSizeChange = (space: keyof GrowingSpacesSizes, value: string) => {
    onSpaceSizesChange({
      ...spaceSizes,
      [space]: value ? Number(value) : 0,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Growing Spaces Available (sq ft)</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="heated-seed-starting"
                className="text-sm font-medium min-w-[300px]"
              >
                Heated Seed Starting Space
              </label>
              <Input
                id="heated-seed-starting"
                type="number"
                placeholder="Size in sq ft"
                className="w-32"
                value={spaceSizes.heated_seed_starting ?? 0}
                onChange={(e) => handleSizeChange("heated_seed_starting", e.target.value)}
                min={0}
                step={100}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="heated-greenhouse"
                className="text-sm font-medium min-w-[300px]"
              >
                Heated Greenhouse Space
              </label>
              <Input
                id="heated-greenhouse"
                type="number"
                placeholder="Size in sq ft"
                className="w-32"
                value={spaceSizes.heated_greenhouse ?? 0}
                onChange={(e) => handleSizeChange("heated_greenhouse", e.target.value)}
                min={0}
                step={100}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="unheated-polytunnel"
                className="text-sm font-medium min-w-[300px]"
              >
                Unheated Poly-tunnel Space
              </label>
              <Input
                id="unheated-polytunnel"
                type="number"
                placeholder="Size in sq ft"
                className="w-32"
                value={spaceSizes.unheated_polytunnel ?? 0}
                onChange={(e) => handleSizeChange("unheated_polytunnel", e.target.value)}
                min={0}
                step={100}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="hydroponics"
                className="text-sm font-medium min-w-[300px]"
              >
                Hydroponics
              </label>
              <Input
                id="hydroponics"
                type="number"
                placeholder="Size in sq ft"
                className="w-32"
                value={spaceSizes.hydroponics ?? 0}
                onChange={(e) => handleSizeChange("hydroponics", e.target.value)}
                min={0}
                step={100}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="outdoor-garden-irrigated"
                className="text-sm font-medium min-w-[300px]"
              >
                Outdoor Garden with Irrigation
              </label>
              <Input
                id="outdoor-garden-irrigated"
                type="number"
                placeholder="Size in sq ft"
                className="w-32"
                value={spaceSizes.outdoor_garden_irrigated ?? 0}
                onChange={(e) => handleSizeChange("outdoor_garden_irrigated", e.target.value)}
                min={0}
                step={100}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="outdoor-garden-no-irrigation"
                className="text-sm font-medium min-w-[300px]"
              >
                Outdoor Garden without Irrigation
              </label>
              <Input
                id="outdoor-garden-no-irrigation"
                type="number"
                placeholder="Size in sq ft"
                className="w-32"
                value={spaceSizes.outdoor_garden_no_irrigation ?? 0}
                onChange={(e) => handleSizeChange("outdoor_garden_no_irrigation", e.target.value)}
                min={0}
                step={100}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
