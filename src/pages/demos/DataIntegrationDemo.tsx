import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { findCompanionData } from "@/data/companionPlanting";
import { hardinessZones } from "@/data/gardenVegetables";
import { Plant, PlantCategory, fetchPlants, fetchPlantingDates, insertInitialPlantData } from "@/data/gardenPlants";

const categoryNames: Record<PlantCategory, string> = {
  root_vegetable: "Root Vegetables",
  leafy_green: "Leafy Greens",
  fruiting_vegetable: "Fruiting Vegetables",
  brassica: "Brassicas",
  legume: "Legumes",
  allium: "Alliums",
  herb: "Herbs",
  fruit_bush: "Fruit Bushes",
  climbing_vegetable: "Climbing Vegetables"
};

const DataIntegrationDemo = () => {
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("5");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [plantingDates, setPlantingDates] = useState<Record<string, Record<string, string>>>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      await insertInitialPlantData();
      
      const plantsData = await fetchPlants();
      const datesData = await fetchPlantingDates();
      
      setPlants(plantsData);
      
      const datesMap: Record<string, Record<string, string>> = {};
      datesData.forEach(date => {
        if (!datesMap[date.plant_id]) {
          datesMap[date.plant_id] = {};
        }
        datesMap[date.plant_id][date.zone] = date.sowing_dates;
      });
      setPlantingDates(datesMap);

      toast({
        title: "Data loaded",
        description: "Initial plant data has been loaded successfully",
      });
    };
    
    loadData();
  }, [toast]);

  const handleVegetableSelection = (vegetableName: string) => {
    if (selectedVegetables.includes(vegetableName)) {
      setSelectedVegetables(selectedVegetables.filter(v => v !== vegetableName));
    } else if (selectedVegetables.length < 20) {
      setSelectedVegetables([...selectedVegetables, vegetableName]);
    } else {
      toast({
        title: "Selection limit reached",
        description: "You can only select up to 20 plants",
      });
    }
  };

  const getCompanionStatus = (plant1: string, plant2: string) => {
    const data1 = findCompanionData(plant1);
    const data2 = findCompanionData(plant2);
    
    if (!data1 || !data2) return "unknown";
    
    if (data1.companions.includes(plant2)) return "companion";
    if (data1.avoids.includes(plant2)) return "avoid";
    return "neutral";
  };

  const plantsByCategory = plants.reduce((acc, plant) => {
    if (!acc[plant.category]) {
      acc[plant.category] = [];
    }
    acc[plant.category].push(plant);
    return acc;
  }, {} as Record<PlantCategory, Plant[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Smart Garden Planning</h1>
          <div className="text-lg text-gray-600 max-w-3xl mx-auto space-y-4">
            <p>
              Select vegetables from the list below to analyze their compatibility
              and create an optimal garden layout.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg text-left">
              <h2 className="text-xl font-semibold mb-2">How This Tool Works:</h2>
              <p className="mb-2">
                This garden planning tool uses a comprehensive static database to help you make informed decisions about your garden layout. The data is sourced from established gardening resources and agricultural research:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Vegetable Database:</strong> Contains detailed information about common garden vegetables, including scientific names, growing requirements, and planting dates. This data is maintained in a static TypeScript file (gardenVegetables.ts) and is based on USDA guidelines and agricultural extension services recommendations.
                </li>
                <li>
                  <strong>Companion Planting Matrix:</strong> Uses pre-defined relationships between plants to show which vegetables grow well together and which should be kept apart. These relationships are documented in our companionPlanting.ts file and are derived from traditional gardening wisdom and modern agricultural research.
                </li>
                <li>
                  <strong>Zone-Based Planting Dates:</strong> Provides specific sowing dates based on your selected USDA hardiness zone to optimize planting times. The dates are aligned with USDA recommendations for each hardiness zone.
                </li>
                <li>
                  <strong>Selection System:</strong> Allows you to choose up to 20 vegetables at once to analyze their compatibility and generate a personalized planting guide. The analysis is performed in real-time using our integrated companion planting database.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="zone-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Hardiness Zone
          </label>
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-full md:w-[300px]">
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

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-8">
              {Object.entries(plantsByCategory).map(([category, categoryPlants]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-xl font-semibold">{categoryNames[category as PlantCategory]}</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Scientific Name</TableHead>
                          <TableHead>Sun Requirements</TableHead>
                          <TableHead>Sowing Method</TableHead>
                          <TableHead>Sowing Dates</TableHead>
                          <TableHead>Height (cm)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryPlants.map((plant) => (
                          <TableRow key={plant.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedVegetables.includes(plant.name)}
                                onCheckedChange={() => handleVegetableSelection(plant.name)}
                              />
                            </TableCell>
                            <TableCell className="font-medium capitalize">{plant.name}</TableCell>
                            <TableCell>{plant.binomialName}</TableCell>
                            <TableCell>{plant.sunRequirements}</TableCell>
                            <TableCell>{plant.sowingMethod}</TableCell>
                            <TableCell>
                              {plantingDates[plant.id]?.[selectedZone] || "Not recommended for this zone"}
                            </TableCell>
                            <TableCell>{plant.height || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}

              {selectedVegetables.length > 0 && (
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataIntegrationDemo;
