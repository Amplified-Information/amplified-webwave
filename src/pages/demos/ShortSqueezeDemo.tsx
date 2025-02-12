
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Info } from "lucide-react";
import { ShortSqueezeAnalyzer } from "@/components/demos/investment-research/short-squeeze/ShortSqueezeAnalyzer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Database } from "lucide-react";

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

        <Card className="mt-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">API Capabilities Reference</h2>
            <p className="text-gray-600 mb-6">
              Alpha Vantage provides comprehensive market data that can be used for advanced stock screening:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">Core Stock Data</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Time series data (daily, weekly, monthly)</li>
                  <li>Real-time quotes</li>
                  <li>Company fundamentals</li>
                  <li>Market cap and P/E ratios</li>
                  <li>Earnings and dividend data</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Technical Indicators</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>RSI (Relative Strength Index)</li>
                  <li>Moving averages (SMA, EMA)</li>
                  <li>MACD</li>
                  <li>Bollinger Bands</li>
                  <li>Volume analysis</li>
                </ul>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold text-lg mb-3">Screening Capabilities</h3>
              <p className="text-gray-600 mb-4">
                These APIs can be used to create comprehensive stock screeners with filters for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Market capitalization ranges</li>
                <li>Price-to-earnings ratios</li>
                <li>Dividend yields</li>
                <li>Short interest and days to cover</li>
                <li>Volume trends and price momentum</li>
                <li>Technical indicator thresholds</li>
                <li>Fundamental metrics like profit margins and debt levels</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Data Storage Considerations</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Processing market data at scale requires significant storage capacity. Here's an approximation of the data volume:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
              <li>Per stock: ~30KB monthly (basic info, daily prices, fundamentals)</li>
              <li>US market coverage (~6,100 stocks): ~183MB monthly</li>
              <li>Annual data volume: ~2.2GB</li>
            </ul>
            <p className="text-gray-600 mb-4">
              To manage this volume efficiently, the application implements selective data storage, focusing on actively monitored stocks and maintaining rolling windows of historical data.
            </p>
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Custom API Gateway Integration</h3>
              <p className="text-gray-600">
                For scenarios requiring unlimited storage capacity, the application can be configured to interface with a custom API gateway that connects to your own database infrastructure. This setup requires:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
                <li>A REST API endpoint serving as the gateway to your database</li>
                <li>Proper authentication and CORS configuration</li>
                <li>Rate limiting implementation for API stability</li>
                <li>Data synchronization strategy for real-time updates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShortSqueezeDemo;
