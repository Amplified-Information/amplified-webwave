
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface GrowingSpaces {
  heated_seed_starting: boolean;
  heated_greenhouse: boolean;
  unheated_polytunnel: boolean;
  hydroponics: boolean;
  outdoor_garden_irrigated: boolean;
  outdoor_garden_no_irrigation: boolean;
}

interface GrowingSpacesSelectorProps {
  growingSpaces: GrowingSpaces;
  onGrowingSpacesChange: (spaces: GrowingSpaces) => void;
}

export const GrowingSpacesSelector = ({
  growingSpaces,
  onGrowingSpacesChange,
}: GrowingSpacesSelectorProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Growing Spaces Available</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
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
            <div className="flex items-center space-x-2">
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
            <div className="flex items-center space-x-2">
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
            <div className="flex items-center space-x-2">
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
            <div className="flex items-center space-x-2">
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
            <div className="flex items-center space-x-2">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
