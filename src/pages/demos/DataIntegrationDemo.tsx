
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PlantTable from "@/components/garden/PlantTable";
import { PlantsByFamily } from "@/types/garden";
import { GardenZoneSelector } from "@/components/garden/GardenZoneSelector";
import { GrowingSpacesSelector } from "@/components/garden/GrowingSpacesSelector";
import { GardenInfoSection } from "@/components/garden/GardenInfoSection";
import { GardenReport } from "@/components/garden/GardenReport";

interface SpaceSizes {
  heated_seed_starting?: number;
  heated_greenhouse?: number;
  unheated_polytunnel?: number;
  hydroponics?: number;
  outdoor_garden_irrigated?: number;
  outdoor_garden_no_irrigation?: number;
}

const DataIntegrationDemo = () => {
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("5");
  const [plants, setPlants] = useState<PlantsByFamily>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<string>("");
  const [growingSpaces, setGrowingSpaces] = useState({
    heated_seed_starting: false,
    heated_greenhouse: false,
    unheated_polytunnel: false,
    hydroponics: false,
    outdoor_garden_irrigated: false,
    outdoor_garden_no_irrigation: false,
  });
  const [spaceSizes, setSpaceSizes] = useState<SpaceSizes>({});
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
    setSelectedVegetables(prev => 
      prev.includes(vegetableName)
        ? prev.filter(v => v !== vegetableName)
        : [...prev, vegetableName]
    );
  };

  const generateReport = async () => {
    // Calculate total garden size from individual spaces
    const totalGardenSize = Object.values(spaceSizes).reduce((sum, size) => sum + (size || 0), 0);
    
    if (totalGardenSize === 0 || selectedVegetables.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter space sizes and select at least one vegetable.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-garden-report', {
        body: {
          hardinessZone: selectedZone,
          gardenSize: totalGardenSize,
          selectedPlants: selectedVegetables,
          growingSpaces: Object.fromEntries(
            Object.entries(growingSpaces).map(([key, value]) => [
              key,
              value ? { enabled: true, size: spaceSizes[key as keyof SpaceSizes] || 0 } : { enabled: false, size: 0 }
            ])
          ),
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
            <GardenInfoSection />
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <GardenZoneSelector
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
          />

          <GrowingSpacesSelector
            growingSpaces={growingSpaces}
            spaceSizes={spaceSizes}
            onGrowingSpacesChange={setGrowingSpaces}
            onSpaceSizesChange={setSpaceSizes}
          />
        </div>

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
            <GardenReport
              isGenerating={isGeneratingReport}
              report={report}
              onGenerate={generateReport}
              disabled={!Object.values(spaceSizes).some(size => (size || 0) > 0) || selectedVegetables.length === 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataIntegrationDemo;
