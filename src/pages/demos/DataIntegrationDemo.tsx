
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
import CompanionPlantingMatrix from "@/components/garden/CompanionPlantingMatrix";
import { PlantsByFamily } from "@/types/garden";
import { Loader2 } from "lucide-react";

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
    } else if (selectedVegetables.length < 20) {
      setSelectedVegetables([...selectedVegetables, vegetableName]);
    } else {
      toast({
        title: "Selection limit reached",
        description: "You can only select up to 20 vegetables",
      });
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
            <div className="bg-blue-50 p-6 rounded-lg text-left">
              <h2 className="text-xl font-semibold mb-2">How This Tool Works:</h2>
              <p className="mb-2">
                This garden planning tool uses a comprehensive database to help you make informed decisions about your garden layout. Plants are organized by botanical families to help you understand their relationships and growing requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Botanical Families:</strong> Plants are grouped by their botanical families, showing related species that often have similar needs and growing patterns.
                </li>
                <li>
                  <strong>Companion Planting Matrix:</strong> Uses pre-defined relationships between plants to show which vegetables grow well together and which should be kept apart.
                </li>
                <li>
                  <strong>Zone-Based Planting Dates:</strong> Provides specific sowing dates based on your selected USDA hardiness zone to optimize planting times.
                </li>
                <li>
                  <strong>Selection System:</strong> Choose up to 20 vegetables to analyze their compatibility and generate a personalized planting guide.
                </li>
              </ul>
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
                  <CompanionPlantingMatrix selectedVegetables={selectedVegetables} />
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
