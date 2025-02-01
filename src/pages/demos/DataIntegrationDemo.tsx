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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch plant data. Please try again.",
        variant: "destructive",
      });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Smart Garden Planning</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for plants and discover their growing requirements. This demo showcases
            real-time data integration with the OpenFarm API.
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
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