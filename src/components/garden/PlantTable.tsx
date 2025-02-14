
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plant } from "@/types/garden";

interface PlantTableProps {
  plants: Plant[];
  selectedVegetables: string[];
  onVegetableSelect: (vegetableName: string) => void;
}

const PlantTable = ({ plants, selectedVegetables, onVegetableSelect }: PlantTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Scientific Name</TableHead>
          <TableHead>Genus</TableHead>
          <TableHead>Species</TableHead>
          <TableHead>Variety</TableHead>
          <TableHead>Sun Requirements</TableHead>
          <TableHead>Sowing Method</TableHead>
          <TableHead>Height (cm)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plants.map((plant) => (
          <TableRow key={plant.id}>
            <TableCell>
              <Checkbox
                checked={selectedVegetables.includes(plant.name)}
                onCheckedChange={() => onVegetableSelect(plant.name)}
              />
            </TableCell>
            <TableCell className="font-medium capitalize">{plant.name}</TableCell>
            <TableCell><span className="italic">{plant.binomial_name}</span></TableCell>
            <TableCell>{plant.genus}</TableCell>
            <TableCell className="italic">{plant.species}</TableCell>
            <TableCell className="italic">{plant.variety ? `var. ${plant.variety}` : ''}</TableCell>
            <TableCell>{plant.sun_requirements}</TableCell>
            <TableCell>{plant.sowing_method}</TableCell>
            <TableCell>{plant.height || "N/A"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PlantTable;
