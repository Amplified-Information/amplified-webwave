import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findCompanionData } from "@/data/companionPlanting";
import { Checkbox } from "@/components/ui/checkbox";

interface Plant {
  _id: string;
  name: string;
  binomial_name: string;
  description: string;
  sun_requirements: string;
  sowing_method: string;
  spread?: number;
  row_spacing?: number;
  height?: number;
}

const DataIntegrationDemo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: plants, isLoading } = useQuery({
    queryKey: ["plants", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const response = await fetch(
        `https://openfarm.cc/api/v1/crops?filter=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch plants");
      }
      const data = await response.json();
      return data.data.map((item: any) => ({
        _id: item.id,
        name: item.attributes.name,
        binomial_name: item.attributes.binomial_name,
        description: item.attributes.description,
        sun_requirements: item.attributes.sun_requirements,
        sowing_method: item.attributes.sowing_method,
        spread: item.attributes.spread,
        row_spacing: item.attributes.row_spacing,
        height: item.attributes.height,
      }));
    },
    enabled: searchTerm.length > 2,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch plant data. Please try again.",
          variant: "destructive",
        });
      },
    },
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.length < 3) {
      toast({
        title: "Search term too short",
        description: "Please enter at least 3 characters to search",
      });
      return;
    }
  };

  const handlePlantSelection = (plantName: string) => {
    if (selectedPlants.includes(plantName)) {
      setSelectedPlants(selectedPlants.filter(p => p !== plantName));
    } else if (selectedPlants.length < 20) {
      setSelectedPlants([...selectedPlants, plantName]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Smart Garden Planning</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for plants to discover their growing requirements and companion planting
            recommendations. Select up to 20 plants to analyze their compatibility.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <Input
                type="text"
                placeholder="Search for plants (e.g., tomato, lettuce)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>

            {isLoading ? (
              <div className="text-center py-8">Loading plants...</div>
            ) : plants && plants.length > 0 ? (
              <div className="space-y-8">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Scientific Name</TableHead>
                        <TableHead>Sun Requirements</TableHead>
                        <TableHead>Sowing Method</TableHead>
                        <TableHead>Height (cm)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plants.map((plant: Plant) => (
                        <TableRow key={plant._id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPlants.includes(plant.name)}
                              onCheckedChange={() => handlePlantSelection(plant.name)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{plant.name}</TableCell>
                          <TableCell>{plant.binomial_name || "N/A"}</TableCell>
                          <TableCell>{plant.sun_requirements || "N/A"}</TableCell>
                          <TableCell>{plant.sowing_method || "N/A"}</TableCell>
                          <TableCell>{plant.height || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedPlants.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Companion Planting Analysis</h2>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead></TableHead>
                            {selectedPlants.map((plant) => (
                              <TableHead key={plant} className="min-w-[100px]">
                                {plant}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPlants.map((plant1) => (
                            <TableRow key={plant1}>
                              <TableCell className="font-medium">{plant1}</TableCell>
                              {selectedPlants.map((plant2) => (
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
            ) : searchTerm.length > 2 ? (
              <div className="text-center py-8">No plants found</div>
            ) : (
              <div className="text-center py-8">
                Enter at least 3 characters to search for plants
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataIntegrationDemo;