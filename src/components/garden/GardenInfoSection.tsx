
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GardenProcessDiagram } from "./GardenProcessDiagram";
import { GardenAIAgentsDescription } from "./GardenAIAgentsDescription";

export const GardenInfoSection = () => {
  return (
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
  );
};
