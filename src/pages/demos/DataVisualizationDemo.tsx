import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
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
            Create interactive dashboards and reports
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              alt="Data Visualization Demo"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features Coming Soon</h2>
              <p className="text-gray-600">
                Our data visualization platform will demonstrate:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Interactive charts and graphs</li>
                <li>Custom dashboard creation</li>
                <li>Real-time data updates</li>
                <li>Export and sharing capabilities</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataVisualizationDemo;