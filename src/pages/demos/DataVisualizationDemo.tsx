import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import Globe from "@/components/Globe";
import { LineChart } from "lucide-react";

const DataVisualizationDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <LineChart className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Data Visualization</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive 3D globe visualization showing global data distribution
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <Globe />
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl font-semibold">Interactive Globe Visualization (under development)</h2>
              <p className="text-gray-600">
                This visualization demonstrates global data distribution using Three.js. 
                The globe automatically rotates and displays data points across different locations.
                The green points represent sample data locations that could be customized based on real data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataVisualizationDemo;