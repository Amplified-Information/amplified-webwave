
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FileSearch, TrendingUp, ChartLine, DollarSign, AlertCircle } from "lucide-react";
import { ShortSqueezeAnalyzer } from "@/components/demos/investment-research/short-squeeze/ShortSqueezeAnalyzer";
import { Alert, AlertDescription } from "@/components/ui/alert";

const InvestmentResearchDemo = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <FileSearch className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Investment Research Platform</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered research and analysis tools for smarter investment decisions
          </p>
        </div>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>API Usage Limits:</strong> This demo uses Alpha Vantage API with the following limitations:
            <ul className="list-disc list-inside mt-2 ml-4">
              <li>Up to 5 API requests per minute</li>
              <li>Maximum of 500 API requests per day</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Market Analysis</h2>
              </div>
              <p className="text-gray-600">
                Real-time market data analysis and trend identification using advanced AI algorithms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ChartLine className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Portfolio Analytics</h2>
              </div>
              <p className="text-gray-600">
                Comprehensive portfolio analysis with risk assessment and optimization recommendations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investment Opportunities Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Investment Opportunities</h2>
          <div className="grid gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-semibold">The Short Squeeze</h3>
                </div>
                <p className="text-gray-600">
                  Identify potential short squeeze opportunities through real-time market data analysis 
                  and short interest monitoring.
                </p>
                <ShortSqueezeAnalyzer />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              More features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentResearchDemo;
