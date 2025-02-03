import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { TradeDataVisualizer } from "@/components/TradeDataVisualizer";

const TradeDataDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <BarChart className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">International Trade Data</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive visualization of global trade flows and patterns
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <TradeDataVisualizer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradeDataDemo;