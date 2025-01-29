import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

const RealTimeAnalyticsDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <ChartBar className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Real-time Analytics</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor and analyze data streams in real-time
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
              alt="Real-time Analytics Demo"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features Coming Soon</h2>
              <p className="text-gray-600">
                Our real-time analytics platform will demonstrate:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Live data visualization and dashboards</li>
                <li>Customizable metrics and KPIs</li>
                <li>Trend analysis and forecasting</li>
                <li>Automated reporting systems</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalyticsDemo;