import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AutomatedWorkflowsDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Automated Workflows</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build and manage automated data processing pipelines
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <img
              src="https://images.unsplash.com/photo-1487887235947-a955ef187fcc"
              alt="Automated Workflows Demo"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features Coming Soon</h2>
              <p className="text-gray-600">
                Our automated workflows platform will demonstrate:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Visual workflow builder</li>
                <li>Conditional logic and branching</li>
                <li>Error handling and recovery</li>
                <li>Workflow monitoring and analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomatedWorkflowsDemo;