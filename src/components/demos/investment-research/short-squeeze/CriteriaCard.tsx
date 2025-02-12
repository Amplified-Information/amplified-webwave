
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export const CriteriaCard = () => {
  return (
    <Card className="bg-gray-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Phil Erlanger's Short Squeeze Identification Criteria
            </h4>
            <div className="grid gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700">1. High Short Interest Ratio (SIR)</p>
                <p>Days-to-cover ratio of 5+ indicates potential for trapped short sellers</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">2. Rising Stock Price Strength</p>
                <p>Look for upward price momentum and rising moving averages</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">3. Sentiment Indicators</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Erlanger Short Rank: Measures short position crowding</li>
                  <li>Short Intensity: Indicates short seller aggressiveness</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700">4. Technical Breakouts</p>
                <p>Watch for breaks above key resistance levels (e.g., 52-week highs)</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">5. Volume Confirmation</p>
                <p>Significant volume increase suggests strong buying pressure</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
