import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { hardinessZones } from "@/data/hardinessZones";
import { supabase } from "@/integrations/supabase/client";
import PlantTable from "@/components/garden/PlantTable";
import { PlantsByFamily } from "@/types/garden";
import { Loader2 } from "lucide-react";
import { ProcessDiagram } from "@/components/ProcessDiagram";
import { AIAgentsDescription } from "@/components/demos/machine-learning/AIAgentsDescription";
import { GardenProcessDiagram } from "@/components/garden/GardenProcessDiagram";
import { GardenAIAgentsDescription } from "@/components/garden/GardenAIAgentsDescription";

const DataIntegrationDemo = () => {
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("5");
  const [gardenSize, setGardenSize] = useState<string>("");
  const [plants, setPlants] = useState<PlantsByFamily>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data, error } = await supabase
          .from('plants')
          .select(`
            *,
            botanical_family:botanical_family_id(
              name,
              description
            )
          `);

        if (error) throw error;

        console.log('Fetched plants data:', data);

        const groupedPlants = (data || []).reduce<PlantsByFamily>((acc, plant) => {
          const familyName = plant.botanical_family?.name || 'Uncategorized';
          if (!acc[familyName]) {
            acc[familyName] = [];
          }
          acc[familyName].push(plant);
          return acc;
        }, {});

        Object.keys(groupedPlants).forEach(family => {
          groupedPlants[family].sort((a, b) => a.name.localeCompare(b.name));
        });

        console.log('Grouped and sorted plants:', groupedPlants);

        setPlants(groupedPlants);
      } catch (error) {
        console.error('Error fetching plants:', error);
        toast({
          title: "Error",
          description: "Failed to load plant data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, [toast]);

  const handleVegetableSelection = (vegetableName: string) => {
    if (selectedVegetables.includes(vegetableName)) {
      setSelectedVegetables(selectedVegetables.filter(v => v !== vegetableName));
    } else {
      setSelectedVegetables([...selectedVegetables, vegetableName]);
    }
  };

  const generateReport = async () => {
    if (!gardenSize || selectedVegetables.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter garden size and select at least one vegetable.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-garden-report', {
        body: {
          hardinessZone: selectedZone,
          gardenSize,
          selectedPlants: selectedVegetables,
        },
      });

      if (error) throw error;

      setReport(data.report.report_content.full_report);
      toast({
        title: "Report Generated",
        description: "Your garden planning report has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate garden report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-20">
          <p className="text-center">Loading plant data...</p>
        </div>
      </div>
    );
  }

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
            
            <div className="bg-blue-50 p-6 rounded-lg text-left space-y-6">
              <h2 className="text-xl font-semibold">How This Tool Works:</h2>
              <div className="space-y-4">
                <Tabs defaultValue="process" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="process">Process Flow</TabsTrigger>
                    <TabsTrigger value="data-model">Data Model</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="process" className="mt-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Process Overview</h3>
                      <GardenProcessDiagram />
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg mb-2">Garden Planning AI Team</h3>
                      <p className="mb-4">
                        Our garden planning system uses a team of specialized AI agents, each bringing unique expertise
                        to help create your optimal garden plan:
                      </p>
                      <GardenAIAgentsDescription />
                    </div>
                  </TabsContent>

                  <TabsContent value="data-model" className="mt-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Database Schema</h3>
                      <div className="bg-white p-4 rounded shadow-sm">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`Plants Table
├── id (UUID)
├── name (VARCHAR)
├── botanical_family_id (UUID) → References Botanical_Families
├── species (VARCHAR)
├── binomial_name (VARCHAR)
├── description (TEXT)
├── category (ENUM)
└── growing_requirements (JSON)

Botanical_Families Table
├── id (UUID)
├── name (VARCHAR)
└── description (TEXT)

Garden_Reports Table
├── id (UUID)
├── hardiness_zone (TEXT)
├── garden_size (INTEGER)
├── selected_plants (TEXT[])
└── report_content (JSON)

Planting_Dates Table
├── id (UUID)
├── plant_id (UUID) → References Plants
├── zone (VARCHAR)
└── sowing_dates (VARCHAR)`}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Botanical Families:</strong> Plants are grouped by their botanical families,
                      showing related species that often have similar needs and growing patterns.
                    </li>
                    <li>
                      <strong>Personalized Report:</strong> Includes detailed companion planting analysis,
                      optimal layout suggestions, and specific growing recommendations.
                    </li>
                    <li>
                      <strong>Zone-Based Planting Dates:</strong> Provides specific sowing dates based on
                      your selected USDA hardiness zone to optimize planting times.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zone-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Hardiness Zone
            </label>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-full">
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

          <div>
            <label htmlFor="garden-size" className="block text-sm font-medium text-gray-700 mb-2">
              Garden Size (sq ft)
            </label>
            <Input
              id="garden-size"
              type="number"
              placeholder="Enter garden size"
              value={gardenSize}
              onChange={(e) => setGardenSize(e.target.value)}
              className="w-full"
              step="100"
              min="0"
            />
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-8">
              {Object.entries(plants).map(([familyName, familyPlants]) => (
                <div key={familyName} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">{familyName}</h3>
                  <div className="overflow-x-auto">
                    <PlantTable
                      plants={familyPlants}
                      selectedVegetables={selectedVegetables}
                      onVegetableSelect={handleVegetableSelection}
                    />
                  </div>
                </div>
              ))}

              {selectedVegetables.length > 0 && (
                <>
                  <div className="mt-8">
                    <Button
                      onClick={generateReport}
                      disabled={isGeneratingReport || !gardenSize || selectedVegetables.length === 0}
                      className="w-full md:w-auto"
                    >
                      {isGeneratingReport ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        'Generate Garden Planning Report'
                      )}
                    </Button>
                  </div>

                  {report && (
                    <div className="mt-8 p-6 bg-white rounded-lg shadow">
                      <h3 className="text-2xl font-bold mb-4">Your Garden Planning Report</h3>
                      <div className="prose max-w-none whitespace-pre-wrap">
                        {report}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataIntegrationDemo;
