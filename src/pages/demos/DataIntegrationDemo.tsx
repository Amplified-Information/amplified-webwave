import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";

const DataIntegrationDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Database className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Data Integration</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect and synchronize data from multiple sources seamlessly
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475"
              alt="Data Integration Demo"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features Coming Soon</h2>
              <p className="text-gray-600">
                Our data integration demonstration will showcase:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Real-time data synchronization across multiple sources</li>
                <li>Automated data mapping and transformation</li>
                <li>Error handling and validation workflows</li>
                <li>Custom integration pipelines</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataIntegrationDemo;