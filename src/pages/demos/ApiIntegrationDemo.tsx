import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "lucide-react";
import { useRates } from "@/hooks/useRates";
import { RatesTable } from "@/components/RatesTable";

const ApiIntegrationDemo = () => {
  const { data, isLoading, error } = useRates();
  const filteredRates = data?.Rates.filter((rate) => parseInt(rate.id) <= 8) || [];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Code className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">API Integration</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with external services through our API platform
          </p>
        </div>

        <Card className="mt-8 mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This API</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                This demo showcases real-time integration with a Canadian mortgage rates API. 
                The API provides up-to-date mortgage rate information, allowing for direct 
                comparison between bank rates and our competitive offerings.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Key API Features:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Real-time rate updates throughout the business day</li>
                  <li>Comprehensive comparison between bank rates and our rates</li>
                  <li>Monthly payment calculations for different term lengths</li>
                  <li>Potential savings calculations based on rate differences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardContent className="p-6">
            <a 
              href="https://cuttingedgemortgage.ca/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mb-8 hover:opacity-95 transition-opacity"
            >
              <img
                src="/lovable-uploads/87c4bef0-cf92-4982-8c47-e07cce2a7334.png"
                alt="West Coast Cutting Edge Mortgage Banner"
                className="w-full rounded-lg shadow-md"
              />
            </a>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Current Canadian Mortgage Rates{" "}
                {data && (
                  <span className="text-sm font-normal text-gray-500">
                    (Updated on: {filteredRates[0]?.updated_at})
                  </span>
                )}
              </h2>
            </div>

            {isLoading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading rates...</p>
              </div>
            )}
            
            {error && (
              <div className="text-center py-8">
                <p className="text-red-500">
                  {error instanceof Error ? error.message : "Error loading rates. Please try again later."}
                </p>
              </div>
            )}

            {data && (
              <div className="overflow-x-auto">
                <RatesTable rates={filteredRates} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiIntegrationDemo;