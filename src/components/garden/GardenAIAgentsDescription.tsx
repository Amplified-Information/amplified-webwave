
import { Users } from "lucide-react";

export const GardenAIAgentsDescription = () => {
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg mb-12">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
        <Users className="w-6 h-6" />
        Garden Planning AI Crew
      </h2>
      <div className="grid gap-4 text-left">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Garden Planning Lead</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Coordinates all garden planning aspects and compiles the final report</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Expertise:</span> Master gardener with extensive experience in garden design and plant cultivation</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Responsibility:</span> Ensures comprehensive and well-structured garden plans by coordinating other agents</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Zone Analysis Agent</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Analyzes climate zone requirements and seasonal considerations</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Expertise:</span> Specialist in USDA hardiness zones and microclimate analysis</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Output:</span> Zone-specific planting recommendations and frost date guidance</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Companion Planting Agent</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Evaluates plant compatibility and beneficial combinations</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Expertise:</span> Deep knowledge of plant relationships and mutual benefits</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Output:</span> Detailed companion planting recommendations and spacing guidelines</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Space Optimization Agent</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Calculates optimal garden layout and space utilization</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Expertise:</span> Garden design and spatial planning specialist</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Output:</span> Garden bed layouts and plant spacing recommendations</p>
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium text-primary">Planting Schedule Agent</h3>
          <div className="space-y-2 mt-2">
            <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> Creates detailed planting and maintenance schedules</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Expertise:</span> Specialist in seasonal planting timing and crop rotation</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Output:</span> Week-by-week planting calendar and maintenance tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};
