
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findCompanionData } from "@/data/companionPlanting";

interface CompanionPlantingMatrixProps {
  selectedVegetables: string[];
}

const CompanionPlantingMatrix = ({ selectedVegetables }: CompanionPlantingMatrixProps) => {
  const getCompanionStatus = (plant1: string, plant2: string) => {
    const data1 = findCompanionData(plant1);
    const data2 = findCompanionData(plant2);
    
    if (!data1 || !data2) return "unknown";
    
    if (data1.companions.includes(plant2)) return "companion";
    if (data1.avoids.includes(plant2)) return "avoid";
    return "neutral";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Companion Planting Analysis</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              {selectedVegetables.map((vegetable) => (
                <TableHead key={vegetable} className="min-w-[100px] capitalize">
                  {vegetable}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedVegetables.map((plant1) => (
              <TableRow key={plant1}>
                <TableCell className="font-medium capitalize">{plant1}</TableCell>
                {selectedVegetables.map((plant2) => (
                  <TableCell 
                    key={`${plant1}-${plant2}`}
                    className={
                      plant1 === plant2 
                        ? "bg-gray-100" 
                        : getCompanionStatus(plant1, plant2) === "companion"
                        ? "bg-green-100"
                        : getCompanionStatus(plant1, plant2) === "avoid"
                        ? "bg-red-100"
                        : ""
                    }
                  >
                    {plant1 === plant2 
                      ? "-" 
                      : getCompanionStatus(plant1, plant2) === "companion"
                      ? "✓"
                      : getCompanionStatus(plant1, plant2) === "avoid"
                      ? "✗"
                      : "?"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100"></div>
          <span>Companion plants</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100"></div>
          <span>Avoid planting together</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100"></div>
          <span>Same plant</span>
        </div>
      </div>
    </div>
  );
};

export default CompanionPlantingMatrix;
