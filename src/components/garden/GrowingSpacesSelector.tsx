
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  growingSpaces,
  spaceSizes,
  onGrowingSpacesChange,
  onSpaceSizesChange,
}: GrowingSpacesSelectorProps) => {
  const handleSizeChange = (space: keyof GrowingSpacesSizes, value: string) => {
    onSpaceSizesChange({
      ...spaceSizes,
      [space]: value ? Number(value) : undefined,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Growing Spaces Available</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 min-w-[300px]">
                <Checkbox
                  id="heated-seed-starting"
                  checked={growingSpaces.heated_seed_starting}
                  onCheckedChange={(checked) =>
                    onGrowingSpacesChange({
                      ...growingSpaces,
                      heated_seed_starting: checked === true,
                    })
                  }
                />
                <label
                  htmlFor="heated-seed-starting"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Heated Seed Starting Space
                </label>
              </div>
              {growingSpaces.heated_seed_starting && (
                <Input
                  type="number"
                  placeholder="Size in sq ft"
                  className="w-32"
                  value={spaceSizes.heated_seed_starting || ""}
                  onChange={(e) => handleSizeChange("heated_seed_starting", e.target.value)}
                  min={0}
                  step={1}
                />
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 min-w-[300px]">
                <Checkbox
                  id="heated-greenhouse"
                  checked={growingSpaces.heated_greenhouse}
                  onCheckedChange={(checked) =>
                    onGrowingSpacesChange({
                      ...growingSpaces,
                      heated_greenhouse: checked === true,
                    })
                  }
                />
                <label
                  htmlFor="heated-greenhouse"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Heated Greenhouse Space
                </label>
              </div>
              {growingSpaces.heated_greenhouse && (
                <Input
                  type="number"
                  placeholder="Size in sq ft"
                  className="w-32"
                  value={spaceSizes.heated_greenhouse || ""}
                  onChange={(e) => handleSizeChange("heated_greenhouse", e.target.value)}
                  min={0}
                  step={1}
                />
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 min-w-[300px]">
                <Checkbox
                  id="unheated-polytunnel"
                  checked={growingSpaces.unheated_polytunnel}
                  onCheckedChange={(checked) =>
                    onGrowingSpacesChange({
                      ...growingSpaces,
                      unheated_polytunnel: checked === true,
                    })
                  }
                />
                <label
                  htmlFor="unheated-polytunnel"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Unheated Poly-tunnel Space
                </label>
              </div>
              {growingSpaces.unheated_polytunnel && (
                <Input
                  type="number"
                  placeholder="Size in sq ft"
                  className="w-32"
                  value={spaceSizes.unheated_polytunnel || ""}
                  onChange={(e) => handleSizeChange("unheated_polytunnel", e.target.value)}
                  min={0}
                  step={1}
                />
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 min-w-[300px]">
                <Checkbox
                  id="hydroponics"
                  checked={growingSpaces.hydroponics}
                  onCheckedChange={(checked) =>
                    onGrowingSpacesChange({
                      ...growingSpaces,
                      hydroponics: checked === true,
                    })
                  }
                />
                <label
                  htmlFor="hydroponics"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Hydroponics
                </label>
              </div>
              {growingSpaces.hydroponics && (
                <Input
                  type="number"
                  placeholder="Size in sq ft"
                  className="w-32"
                  value={spaceSizes.hydroponics || ""}
                  onChange={(e) => handleSizeChange("hydroponics", e.target.value)}
                  min={0}
                  step={1}
                />
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 min-w-[300px]">
                <Checkbox
                  id="outdoor-garden-irrigated"
                  checked={growingSpaces.outdoor_garden_irrigated}
                  onCheckedChange={(checked) =>
                    onGrowingSpacesChange({
                      ...growingSpaces,
                      outdoor_garden_irrigated: checked === true,
                    })
                  }
                />
                <label
                  htmlFor="outdoor-garden-irrigated"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Outdoor Garden with Irrigation
                </label>
              </div>
              {growingSpaces.outdoor_garden_irrigated && (
                <Input
                  type="number"
                  placeholder="Size in sq ft"
                  className="w-32"
                  value={spaceSizes.outdoor_garden_irrigated || ""}
                  onChange={(e) => handleSizeChange("outdoor_garden_irrigated", e.target.value)}
                  min={0}
                  step={1}
                />
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 min-w-[300px]">
                <Checkbox
                  id="outdoor-garden-no-irrigation"
                  checked={growingSpaces.outdoor_garden_no_irrigation}
                  onCheckedChange={(checked) =>
                    onGrowingSpacesChange({
                      ...growingSpaces,
                      outdoor_garden_no_irrigation: checked === true,
                    })
                  }
                />
                <label
                  htmlFor="outdoor-garden-no-irrigation"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Outdoor Garden without Irrigation
                </label>
              </div>
              {growingSpaces.outdoor_garden_no_irrigation && (
                <Input
                  type="number"
                  placeholder="Size in sq ft"
                  className="w-32"
                  value={spaceSizes.outdoor_garden_no_irrigation || ""}
                  onChange={(e) => handleSizeChange("outdoor_garden_no_irrigation", e.target.value)}
                  min={0}
                  step={1}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
