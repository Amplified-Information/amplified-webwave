
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Info } from "lucide-react";
import { ShortSqueezeAnalyzer } from "@/components/demos/investment-research/short-squeeze/ShortSqueezeAnalyzer";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ShortSqueezeDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Short Squeeze Finder</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Identify potential short squeeze opportunities through real-time market data analysis
          </p>
        </div>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>API Usage Limits:</strong> This demo uses Alpha Vantage API with the following limitations:
            <ul className="list-disc list-inside mt-2 ml-4">
              <li>Up to 5 API requests per minute</li>
              <li>Maximum of 500 API requests per day</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-6">
            <ShortSqueezeAnalyzer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShortSqueezeDemo;
