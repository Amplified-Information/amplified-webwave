import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import CanadianCitiesWeather from "@/components/CanadianCitiesWeather";
import ProvinceAveragesChart from "@/components/ProvinceAveragesChart";

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
            <h2 className="text-2xl font-semibold mb-6">Canadian Cities Weather Data</h2>
            <CanadianCitiesWeather />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalyticsDemo;