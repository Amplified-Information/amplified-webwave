
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const BondSelector = () => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="timeRange" />
            <Label htmlFor="timeRange">Show last year only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="weeklyAvg" />
            <Label htmlFor="weeklyAvg">Show weekly averages</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
